import crypto from "node:crypto";
import { db } from "./db.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load .env manually without external dependency
function getEnvConfig() {
  const envPath = path.resolve(__dirname, "../.env");
  const config = { ...process.env };
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, "utf8");
      const lines = content.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
          if (!config[key]) {
            config[key] = val;
          }
        }
      }
    } catch (e) {
      // Ignore reading error
    }
  }
  return config;
}

// Retrieve admin password securely from server environment
export function getAdminPassword() {
  const env = getEnvConfig();
  return env.ADMIN_PASSWORD || "deepak_admin_2026";
}

// Timing-safe password verification to prevent timing attacks
export function verifyPassword(providedPassword) {
  if (typeof providedPassword !== "string") return false;
  const adminPassword = getAdminPassword();

  const provHash = crypto.createHash("sha256").update(providedPassword).digest();
  const actualHash = crypto.createHash("sha256").update(adminPassword).digest();

  try {
    return crypto.timingSafeEqual(provHash, actualHash);
  } catch (e) {
    return false;
  }
}

// Brute-force rate limiter (Max 5 failed attempts per 15 mins)
export function checkRateLimit(ip, action = "login", maxAttempts = 5, windowMinutes = 15) {
  const key = `${ip}:${action}`;
  const now = new Date();
  const row = db.prepare("SELECT * FROM rate_limits WHERE key = ?").get(key);

  if (row) {
    if (row.blocked_until && new Date(row.blocked_until) > now) {
      const remainingSeconds = Math.ceil((new Date(row.blocked_until).getTime() - now.getTime()) / 1000);
      return { allowed: false, remainingSeconds };
    }

    const lastAttempt = new Date(row.last_attempt);
    const diffMinutes = (now.getTime() - lastAttempt.getTime()) / (1000 * 60);

    if (diffMinutes > windowMinutes) {
      // Reset window
      db.prepare("UPDATE rate_limits SET attempts = 0, blocked_until = NULL, last_attempt = ? WHERE key = ?")
        .run(now.toISOString(), key);
      return { allowed: true };
    }

    if (row.attempts >= maxAttempts) {
      const blockedUntil = new Date(now.getTime() + windowMinutes * 60 * 1000).toISOString();
      db.prepare("UPDATE rate_limits SET blocked_until = ?, last_attempt = ? WHERE key = ?")
        .run(blockedUntil, now.toISOString(), key);
      return { allowed: false, remainingSeconds: windowMinutes * 60 };
    }
  }

  return { allowed: true };
}

export function recordFailedAttempt(ip, action = "login", maxAttempts = 5, windowMinutes = 15) {
  const key = `${ip}:${action}`;
  const now = new Date();
  const row = db.prepare("SELECT * FROM rate_limits WHERE key = ?").get(key);

  if (row) {
    const attempts = row.attempts + 1;
    let blockedUntil = row.blocked_until;
    if (attempts >= maxAttempts) {
      blockedUntil = new Date(now.getTime() + windowMinutes * 60 * 1000).toISOString();
    }
    db.prepare("UPDATE rate_limits SET attempts = ?, last_attempt = ?, blocked_until = ? WHERE key = ?")
      .run(attempts, now.toISOString(), blockedUntil, key);
  } else {
    db.prepare("INSERT INTO rate_limits (key, attempts, last_attempt, blocked_until) VALUES (?, 1, ?, NULL)")
      .run(key, now.toISOString());
  }
}

export function resetRateLimit(ip, action = "login") {
  const key = `${ip}:${action}`;
  db.prepare("DELETE FROM rate_limits WHERE key = ?").run(key);
}

// Session management
export function createSession() {
  const token = crypto.randomBytes(32).toString("hex");
  const now = new Date();
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  db.prepare("INSERT INTO admin_sessions (token, created_at, expires_at) VALUES (?, ?, ?)")
    .run(token, now.toISOString(), expires.toISOString());

  return token;
}

export function validateSession(token) {
  if (!token || typeof token !== "string") return false;

  const now = new Date().toISOString();
  const row = db.prepare("SELECT * FROM admin_sessions WHERE token = ? AND expires_at > ?").get(token, now);

  return !!row;
}

export function deleteSession(token) {
  if (!token) return;
  db.prepare("DELETE FROM admin_sessions WHERE token = ?").run(token);
}

// Clean up expired sessions periodically
export function cleanExpiredSessions() {
  const now = new Date().toISOString();
  db.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?").run(now);
}

