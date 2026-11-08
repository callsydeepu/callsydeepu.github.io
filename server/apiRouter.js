import { db } from "./db.js";
import {
  verifyPassword,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  createSession,
  validateSession,
  deleteSession
} from "./auth.js";
import crypto from "node:crypto";

// Helper to extract cookies from request headers
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  const items = cookieHeader.split(";");
  for (const item of items) {
    const [name, ...rest] = item.trim().split("=");
    if (name) {
      cookies[name] = decodeURIComponent(rest.join("="));
    }
  }
  return cookies;
}

// Helper to extract client IP
function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "127.0.0.1";
}

// Send JSON response
function sendJson(res, statusCode, data, headers = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store, no-cache, must-revalidate",
    ...headers
  });
  res.end(JSON.stringify(data));
}

// Read body helper
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        // 1MB max body limit
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

// Middleware: Authenticate admin
function extractSessionToken(req) {
  const cookies = parseCookies(req.headers.cookie);
  if (cookies.admin_session) {
    return cookies.admin_session;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  return null;
}

function checkAdminAuth(req) {
  const token = extractSessionToken(req);
  return validateSession(token);
}

// Main API Dispatcher
export async function handleApiRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;
  const method = req.method.toUpperCase();
  const ip = getClientIp(req);

  try {
    // -------------------------------------------------------------
    // 1. PUBLIC: Get full portfolio data
    // -------------------------------------------------------------
    if (pathname === "/api/portfolio" && method === "GET") {
      const bio = db.prepare("SELECT * FROM bio WHERE id = 'main'").get();
      const certifications = db.prepare("SELECT * FROM certifications ORDER BY sort_order ASC, created_at ASC").all();
      const rawSkills = db.prepare("SELECT * FROM skills ORDER BY sort_order ASC, created_at ASC").all();
      const rawProjects = db.prepare("SELECT * FROM projects ORDER BY sort_order ASC, created_at ASC").all();

      // Transform raw skills into category groups matching portfolio format
      const categoryMap = new Map();
      for (const s of rawSkills) {
        if (!categoryMap.has(s.category)) {
          categoryMap.set(s.category, {
            category: s.category,
            sublabel: s.sublabel || "",
            lines: []
          });
        }
        const group = categoryMap.get(s.category);
        const lineIdx = (s.line_number || 1) - 1;
        while (group.lines.length <= lineIdx) {
          group.lines.push({ items: [] });
        }
        if (s.is_highlight) {
          group.lines[lineIdx].highlight = s.name;
        } else {
          group.lines[lineIdx].items.push(s.name);
        }
      }
      const techStackGroups = Array.from(categoryMap.values());

      // Transform projects with parsed JSON
      const projects = rawProjects.map((p) => ({
        ...p,
        stack: JSON.parse(p.stack || "[]"),
        metrics: JSON.parse(p.metrics || "[]")
      }));

      return sendJson(res, 200, {
        bio,
        certifications,
        techStackGroups,
        rawSkills,
        projects
      });
    }

    // -------------------------------------------------------------
    // 2. PUBLIC: Contact Form Submission
    // -------------------------------------------------------------
    if (pathname === "/api/contact" && method === "POST") {
      const rate = checkRateLimit(ip, "contact", 5, 10);
      if (!rate.allowed) {
        return sendJson(res, 429, {
          error: `Too many messages sent. Please wait ${rate.remainingSeconds} seconds before trying again.`
        });
      }

      const body = await readJsonBody(req);
      const { name, email, subject, message, hp_website } = body;

      // Honeypot anti-spam check
      if (hp_website) {
        // Silently succeed for bot traps
        return sendJson(res, 200, { success: true, message: "Message received" });
      }

      if (!name || typeof name !== "string" || name.trim().length < 2) {
        return sendJson(res, 400, { error: "Please provide a valid name." });
      }
      if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return sendJson(res, 400, { error: "Please provide a valid email address." });
      }
      if (!message || typeof message !== "string" || message.trim().length < 5) {
        return sendJson(res, 400, { error: "Please enter a message of at least 5 characters." });
      }

      const id = `msg-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
      const now = new Date().toISOString();
      const ipHash = crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);

      db.prepare(`
        INSERT INTO messages (id, name, email, subject, message, is_read, created_at, ip_hash)
        VALUES (?, ?, ?, ?, ?, 0, ?, ?)
      `).run(
        id,
        name.trim().slice(0, 100),
        email.trim().toLowerCase().slice(0, 120),
        (subject || "General Inquiry").trim().slice(0, 150),
        message.trim().slice(0, 3000),
        now,
        ipHash
      );

      recordFailedAttempt(ip, "contact", 5, 10); // Increment contact count for rate limit

      return sendJson(res, 201, {
        success: true,
        message: "Your message has been delivered to Sai Deepak."
      });
    }

    // -------------------------------------------------------------
    // 3. AUTH: Login
    // -------------------------------------------------------------
    if (pathname === "/api/auth/login" && method === "POST") {
      const rate = checkRateLimit(ip, "login", 5, 15);
      if (!rate.allowed) {
        return sendJson(res, 429, {
          error: `Too many failed attempts. Login is temporarily locked for ${Math.ceil(rate.remainingSeconds / 60)} minutes.`
        });
      }

      const body = await readJsonBody(req);
      const { password } = body;

      const isValid = verifyPassword(password);
      if (!isValid) {
        recordFailedAttempt(ip, "login", 5, 15);
        return sendJson(res, 401, {
          error: "Incorrect admin password. Please try again."
        });
      }

      // Success: Reset rate limit and issue secure session
      resetRateLimit(ip, "login");
      const token = createSession();

      // Secure cookie with SameSite=Strict and HttpOnly
      const cookieHeader = `admin_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`;

      return sendJson(
        res,
        200,
        { success: true, token },
        { "Set-Cookie": cookieHeader }
      );
    }

    // -------------------------------------------------------------
    // 4. AUTH: Verify Session
    // -------------------------------------------------------------
    if (pathname === "/api/auth/verify" && method === "GET") {
      const authenticated = checkAdminAuth(req);
      return sendJson(res, 200, { authenticated });
    }

    // -------------------------------------------------------------
    // 5. AUTH: Logout
    // -------------------------------------------------------------
    if (pathname === "/api/auth/logout" && method === "POST") {
      const token = extractSessionToken(req);
      if (token) {
        deleteSession(token);
      }
      const clearCookie = `admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      return sendJson(res, 200, { success: true }, { "Set-Cookie": clearCookie });
    }

    // =============================================================
    // PROTECTED ADMIN APIS (Requires Valid Session)
    // =============================================================
    if (pathname.startsWith("/api/admin")) {
      if (!checkAdminAuth(req)) {
        return sendJson(res, 401, { error: "Unauthorized access. Please log in as admin." });
      }

      // A. Admin Overview Stats
      if (pathname === "/api/admin/overview" && method === "GET") {
        const certCount = db.prepare("SELECT COUNT(*) as count FROM certifications").get().count;
        const skillCount = db.prepare("SELECT COUNT(*) as count FROM skills").get().count;
        const projectCount = db.prepare("SELECT COUNT(*) as count FROM projects").get().count;
        const totalMessages = db.prepare("SELECT COUNT(*) as count FROM messages").get().count;
        const unreadMessages = db.prepare("SELECT COUNT(*) as count FROM messages WHERE is_read = 0").get().count;
        const recentMessages = db.prepare("SELECT * FROM messages ORDER BY created_at DESC LIMIT 5").all();

        return sendJson(res, 200, {
          certCount,
          skillCount,
          projectCount,
          totalMessages,
          unreadMessages,
          recentMessages
        });
      }

      // B. Messages List
      if (pathname === "/api/admin/messages" && method === "GET") {
        const messages = db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all();
        return sendJson(res, 200, { messages });
      }

      // C. Toggle Read / Unread Message
      const patchMsgMatch = pathname.match(/^\/api\/admin\/messages\/([^/]+)$/);
      if (patchMsgMatch && method === "PATCH") {
        const msgId = patchMsgMatch[1];
        const body = await readJsonBody(req);
        const isRead = body.is_read ? 1 : 0;
        db.prepare("UPDATE messages SET is_read = ? WHERE id = ?").run(isRead, msgId);
        return sendJson(res, 200, { success: true });
      }

      // D. Delete Message
      if (patchMsgMatch && method === "DELETE") {
        const msgId = patchMsgMatch[1];
        db.prepare("DELETE FROM messages WHERE id = ?").run(msgId);
        return sendJson(res, 200, { success: true });
      }

      // E. Update Bio Profile
      if (pathname === "/api/admin/bio" && method === "PUT") {
        const body = await readJsonBody(req);
        if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2) {
          return sendJson(res, 400, { error: "Name must be at least 2 characters." });
        }

        db.prepare(`
          UPDATE bio SET
            name = ?, displaySurname = ?, displayName = ?, role = ?, positioning = ?,
            primaryLanguage = ?, secondaryHighlight = ?, summary = ?, manifestoLead = ?,
            manifestoSub = ?, location = ?, email = ?, github = ?, linkedin = ?,
            leetcode = ?, status = ?, updated_at = datetime('now')
          WHERE id = 'main'
        `).run(
          body.name.trim(),
          (body.displaySurname || "").trim(),
          (body.displayName || "").trim(),
          (body.role || "").trim(),
          (body.positioning || "").trim(),
          (body.primaryLanguage || "").trim(),
          (body.secondaryHighlight || "").trim(),
          (body.summary || "").trim(),
          (body.manifestoLead || "").trim(),
          (body.manifestoSub || "").trim(),
          (body.location || "").trim(),
          (body.email || "").trim(),
          (body.github || "").trim(),
          (body.linkedin || "").trim(),
          (body.leetcode || "").trim(),
          (body.status || "").trim()
        );
        return sendJson(res, 200, { success: true });
      }

      // F. Certifications CRUD
      if (pathname === "/api/admin/certifications" && method === "POST") {
        const body = await readJsonBody(req);
        if (!body.title || typeof body.title !== "string" || body.title.trim().length < 2) {
          return sendJson(res, 400, { error: "Certification title is required (min 2 characters)." });
        }
        if (!body.issuer || typeof body.issuer !== "string" || body.issuer.trim().length < 2) {
          return sendJson(res, 400, { error: "Issuing organization is required." });
        }

        const title = body.title.trim();
        const issuer = body.issuer.trim();

        // Prevent duplicates
        const existing = db.prepare("SELECT id FROM certifications WHERE LOWER(title) = ? AND LOWER(issuer) = ?")
          .get(title.toLowerCase(), issuer.toLowerCase());
        if (existing) {
          return sendJson(res, 409, { error: `Certification "${title}" from "${issuer}" already exists.` });
        }

        const id = body.id || `cert-${Date.now()}`;
        const count = db.prepare("SELECT COUNT(*) as count FROM certifications").get().count;
        const number = body.number || String(count + 1).padStart(2, "0");

        db.prepare(`
          INSERT INTO certifications (id, number, title, issuer, year, category, domain, credentialType, link, highlight, sort_order, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).run(
          id,
          number,
          title,
          issuer,
          (body.year || new Date().getFullYear().toString()).trim(),
          (body.category || "AI / ML").trim(),
          (body.domain || "").trim(),
          (body.credentialType || "Certificate").trim(),
          (body.link || "").trim(),
          body.highlight ? 1 : 0,
          body.sort_order || count + 1
        );
        return sendJson(res, 201, { success: true, id });
      }

      const certMatch = pathname.match(/^\/api\/admin\/certifications\/([^/]+)$/);
      if (certMatch && method === "PUT") {
        const certId = certMatch[1];
        const body = await readJsonBody(req);

        const existing = db.prepare("SELECT id FROM certifications WHERE id = ?").get(certId);
        if (!existing) {
          return sendJson(res, 404, { error: "Certification record not found." });
        }

        if (!body.title || typeof body.title !== "string" || body.title.trim().length < 2) {
          return sendJson(res, 400, { error: "Certification title is required." });
        }

        db.prepare(`
          UPDATE certifications SET
            title = ?, issuer = ?, year = ?, category = ?, domain = ?,
            credentialType = ?, link = ?, highlight = ?, sort_order = ?
          WHERE id = ?
        `).run(
          body.title.trim(),
          (body.issuer || "").trim(),
          (body.year || "").trim(),
          (body.category || "AI / ML").trim(),
          (body.domain || "").trim(),
          (body.credentialType || "").trim(),
          (body.link || "").trim(),
          body.highlight ? 1 : 0,
          body.sort_order || 0,
          certId
        );
        return sendJson(res, 200, { success: true });
      }

      if (certMatch && method === "DELETE") {
        const certId = certMatch[1];
        const existing = db.prepare("SELECT id FROM certifications WHERE id = ?").get(certId);
        if (!existing) {
          return sendJson(res, 404, { error: "Certification not found." });
        }

        db.prepare("DELETE FROM certifications WHERE id = ?").run(certId);
        return sendJson(res, 200, { success: true });
      }

      // G. Skills CRUD
      if (pathname === "/api/admin/skills" && method === "POST") {
        const body = await readJsonBody(req);
        if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
          return sendJson(res, 400, { error: "Skill name is required." });
        }
        if (!body.category || typeof body.category !== "string") {
          return sendJson(res, 400, { error: "Category is required." });
        }

        const skillName = body.name.toUpperCase().trim();
        const category = body.category.trim();

        // Prevent duplicate skill in same category
        const existing = db.prepare("SELECT id FROM skills WHERE category = ? AND UPPER(name) = ?")
          .get(category, skillName);
        if (existing) {
          return sendJson(res, 409, { error: `Skill "${skillName}" already exists in ${category}.` });
        }

        const id = `skill-${Date.now()}`;
        const count = db.prepare("SELECT COUNT(*) as count FROM skills WHERE category = ?").get(category).count;

        db.prepare(`
          INSERT INTO skills (id, category, sublabel, name, is_highlight, line_number, sort_order, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).run(
          id,
          category,
          (body.sublabel || "").trim(),
          skillName,
          body.is_highlight ? 1 : 0,
          body.line_number || 1,
          count + 1
        );
        return sendJson(res, 201, { success: true, id });
      }

      const skillMatch = pathname.match(/^\/api\/admin\/skills\/([^/]+)$/);
      if (skillMatch && method === "PUT") {
        const skillId = skillMatch[1];
        const body = await readJsonBody(req);

        const existing = db.prepare("SELECT id FROM skills WHERE id = ?").get(skillId);
        if (!existing) {
          return sendJson(res, 404, { error: "Skill not found." });
        }

        if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
          return sendJson(res, 400, { error: "Skill name cannot be empty." });
        }

        db.prepare(`
          UPDATE skills SET
            category = ?, sublabel = ?, name = ?, is_highlight = ?, line_number = ?, sort_order = ?
          WHERE id = ?
        `).run(
          (body.category || "").trim(),
          (body.sublabel || "").trim(),
          body.name.toUpperCase().trim(),
          body.is_highlight ? 1 : 0,
          body.line_number || 1,
          body.sort_order || 0,
          skillId
        );
        return sendJson(res, 200, { success: true });
      }

      if (skillMatch && method === "DELETE") {
        const skillId = skillMatch[1];
        const existing = db.prepare("SELECT id FROM skills WHERE id = ?").get(skillId);
        if (!existing) {
          return sendJson(res, 404, { error: "Skill not found." });
        }

        db.prepare("DELETE FROM skills WHERE id = ?").run(skillId);
        return sendJson(res, 200, { success: true });
      }

      if (pathname === "/api/admin/skills/highlight" && method === "PUT") {
        const body = await readJsonBody(req);
        // Clear highlight for this category first
        db.prepare("UPDATE skills SET is_highlight = 0 WHERE category = ?").run(body.category);
        if (body.skillId) {
          db.prepare("UPDATE skills SET is_highlight = 1 WHERE id = ?").run(body.skillId);
        }
        return sendJson(res, 200, { success: true });
      }

      // H. Projects CRUD - Reorder (Placed before parameterized project ID match)
      if (pathname === "/api/admin/projects/order" && method === "PUT") {
        const body = await readJsonBody(req);
        if (Array.isArray(body.projectIds)) {
          for (let i = 0; i < body.projectIds.length; i++) {
            const pId = body.projectIds[i];
            const number = String(i + 1).padStart(2, "0");
            db.prepare("UPDATE projects SET sort_order = ?, number = ? WHERE id = ?").run(i + 1, number, pId);
          }
        }
        return sendJson(res, 200, { success: true });
      }

      // H. Projects CRUD - Create
      if (pathname === "/api/admin/projects" && method === "POST") {
        const body = await readJsonBody(req);
        if (!body.title || typeof body.title !== "string" || body.title.trim().length < 2) {
          return sendJson(res, 400, { error: "Project title is required." });
        }
        if (!body.description || typeof body.description !== "string" || body.description.trim().length < 5) {
          return sendJson(res, 400, { error: "Project description must be at least 5 characters." });
        }

        const projectTitle = body.title.toUpperCase().trim();

        // Prevent duplicate project titles
        const existing = db.prepare("SELECT id FROM projects WHERE UPPER(title) = ?").get(projectTitle);
        if (existing) {
          return sendJson(res, 409, { error: `A project with title "${projectTitle}" already exists.` });
        }

        const id = body.id || `proj-${Date.now()}`;
        const count = db.prepare("SELECT COUNT(*) as count FROM projects").get().count;
        const number = body.number || String(count + 1).padStart(2, "0");

        db.prepare(`
          INSERT INTO projects (
            id, number, title, subtitle, category, year, description,
            stack, github, visualType, accent, metrics, featured, sort_order, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).run(
          id,
          number,
          projectTitle,
          (body.subtitle || "").trim(),
          (body.category || "AI SYSTEM").trim(),
          (body.year || new Date().getFullYear().toString()).trim(),
          body.description.trim(),
          JSON.stringify(Array.isArray(body.stack) ? body.stack : []),
          (body.github || "").trim(),
          body.visualType || "agents",
          body.accent || "yellow",
          JSON.stringify(Array.isArray(body.metrics) ? body.metrics : []),
          body.featured !== undefined ? (body.featured ? 1 : 0) : 1,
          count + 1
        );
        return sendJson(res, 201, { success: true, id });
      }

      const projMatch = pathname.match(/^\/api\/admin\/projects\/(?!order$)([^/]+)$/);
      if (projMatch && method === "PUT") {
        const projId = projMatch[1];
        const body = await readJsonBody(req);

        const existing = db.prepare("SELECT id FROM projects WHERE id = ?").get(projId);
        if (!existing) {
          return sendJson(res, 404, { error: "Project not found." });
        }

        if (!body.title || typeof body.title !== "string" || body.title.trim().length < 2) {
          return sendJson(res, 400, { error: "Project title is required." });
        }

        db.prepare(`
          UPDATE projects SET
            number = ?, title = ?, subtitle = ?, category = ?, year = ?,
            description = ?, stack = ?, github = ?, visualType = ?, accent = ?,
            metrics = ?, featured = ?, sort_order = ?
          WHERE id = ?
        `).run(
          body.number,
          (body.title || "").toUpperCase().trim(),
          (body.subtitle || "").trim(),
          (body.category || "").trim(),
          (body.year || "").trim(),
          (body.description || "").trim(),
          JSON.stringify(Array.isArray(body.stack) ? body.stack : []),
          (body.github || "").trim(),
          body.visualType || "agents",
          body.accent || "yellow",
          JSON.stringify(Array.isArray(body.metrics) ? body.metrics : []),
          body.featured ? 1 : 0,
          body.sort_order || 0,
          projId
        );
        return sendJson(res, 200, { success: true });
      }

      if (projMatch && method === "DELETE") {
        const projId = projMatch[1];
        const existing = db.prepare("SELECT id FROM projects WHERE id = ?").get(projId);
        if (!existing) {
          return sendJson(res, 404, { error: "Project not found." });
        }

        db.prepare("DELETE FROM projects WHERE id = ?").run(projId);
        return sendJson(res, 200, { success: true });
      }
    }

    // 404 for unknown API
    return sendJson(res, 404, { error: "API route not found" });
  } catch (err) {
    console.error("API Error:", err);
    return sendJson(res, 500, { error: "Internal Server Error" });
  }
}

