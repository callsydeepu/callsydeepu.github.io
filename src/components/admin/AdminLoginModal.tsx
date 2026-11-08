import React, { useState } from "react";
import { Lock, Eye, EyeOff, X, ShieldAlert, KeyRound } from "lucide-react";
import { usePortfolioData } from "../../context/PortfolioContext";
import { apiFetch } from "../../config/api";

export function AdminLoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, setIsAuthenticated, setIsAdminOpen } =
    usePortfolioData();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the admin password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ password })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (data && data.error) {
          setError(data.error);
        } else if (res.status === 404 || res.status === 405) {
          setError("Backend server is not running or unhosted on this domain. Deploy the backend to Render/Railway and set VITE_API_URL.");
        } else {
          setError("Authentication failed. Invalid password or server error.");
        }
        return;
      }

      // Success: store token for cross-domain auth resilience
      if (data && data.token) {
        localStorage.setItem("admin_token", data.token);
      }

      setIsAuthenticated(true);
      setIsLoginModalOpen(false);
      setPassword("");
      setIsAdminOpen(true);
    } catch (err) {
      setError("Cannot reach backend server. Please verify your backend is running or set VITE_API_URL.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0e0e11] border border-white/15 p-6 sm:p-8 shadow-2xl text-white select-none">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsLoginModalOpen(false);
            setError(null);
            setPassword("");
          }}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#e2ee5a] text-[#0a0a0c] flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#e2ee5a] font-semibold block">
              PORTFOLIO CMS // AUTH
            </span>
            <h2 className="font-condensed font-extrabold text-2xl uppercase tracking-tight text-white leading-none">
              ADMIN ACCESS
            </h2>
          </div>
        </div>

        <p className="text-zinc-400 text-xs sm:text-sm font-sans mb-6 leading-relaxed">
          Enter your admin password to access the content management system. All edits update the public portfolio in real-time.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[11px] text-zinc-400 uppercase tracking-wider mb-2">
              ADMIN PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                autoFocus
                placeholder="••••••••••••"
                className="w-full bg-[#18181c] border border-white/20 text-white px-3.5 py-2.5 pr-10 text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#e2ee5a] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setIsLoginModalOpen(false);
                setError(null);
                setPassword("");
              }}
              className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white border border-white/10 hover:border-white/25 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-[#e2ee5a] text-[#0a0a0c] font-condensed font-extrabold text-sm uppercase tracking-wider py-2.5 px-5 hover:bg-[#ecf85e] disabled:opacity-50 transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? "AUTHENTICATING..." : "UNLOCK CMS →"}</span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
          <span>PROTECTED BY SESSION AUTH</span>
          <span className="text-[#e2ee5a]">LOCAL SQLITE CMS</span>
        </div>
      </div>
    </div>
  );
}

