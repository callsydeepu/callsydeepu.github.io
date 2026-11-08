import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, FileText, Lock, Sun, Moon } from "lucide-react";
import { profile } from "../data";
import { usePortfolioData } from "../context/PortfolioContext";

export function Navbar() {
  const { isAuthenticated, setIsAdminOpen, setIsLoginModalOpen } = usePortfolioData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLightsOn, setIsLightsOn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Listen and sync with Hero lights toggle
  useEffect(() => {
    const handleSync = (e: any) => {
      if (e.detail && typeof e.detail.lightsOn === "boolean") {
        setIsLightsOn(e.detail.lightsOn);
      }
    };
    window.addEventListener("sync-hero-lights", handleSync);
    return () => window.removeEventListener("sync-hero-lights", handleSync);
  }, []);

  const toggleLights = () => {
    const nextState = !isLightsOn;
    setIsLightsOn(nextState);
    window.dispatchEvent(
      new CustomEvent("sync-hero-lights", { detail: { lightsOn: nextState } })
    );
  };

  const navItems = [
    { num: "01", label: "Subject", href: "#subject", sub: "Profile & Philosophy" },
    { num: "02", label: "Case Files", href: "#case-files", sub: "Autonomous Systems" },
    { num: "03", label: "Toolkit", href: "#toolkit", sub: "Arsenals & Technologies" },
    { num: "04", label: "Certifications", href: "#certifications", sub: "Industry Accreditations" },
    { num: "05", label: "Journey", href: "#journey", sub: "Academic Foundations" },
    { num: "06", label: "Hire Me", href: "#hire-me", sub: "Direct Collaboration" }
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    // Smooth jump with slight delay to allow drawer to dismiss
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? "bg-[#0a0a0c]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Monogram Brand */}
        <a
          href="#subject"
          className="flex items-center gap-2.5 sm:gap-3 text-white group"
          aria-label="Sai Deepak Ambati Portfolio"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="font-mono font-extrabold text-sm sm:text-base tracking-widest text-[#e2ee5a] group-hover:scale-105 transition-transform bg-[#e2ee5a]/10 px-2 py-0.5 border border-[#e2ee5a]/30">
            {profile.initials}
          </span>
          <div className="flex flex-col">
            <span className="font-condensed font-bold text-xs sm:text-sm text-white tracking-wider uppercase leading-none">
              SAI DEEPAK
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-ivory-400/70 tracking-widest uppercase leading-tight mt-0.5">
              PORTFOLIO IN SIX CHAPTERS
            </span>
          </div>
        </a>

        {/* Center Chapter Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[11px] font-mono tracking-wider text-ivory-300">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[#e2ee5a] transition-colors uppercase py-1"
            >
              {item.num} {item.label}
            </a>
          ))}
        </nav>

        {/* Right Actions (Desktop) */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Desktop LIGHTS ON / OFF Toggle */}
          <button
            type="button"
            onClick={toggleLights}
            aria-label={isLightsOn ? "Switch to Lights Off" : "Switch to Lights On"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 cursor-pointer ${
              isLightsOn
                ? "bg-[#e2ee5a] text-[#0a0a0c] font-bold shadow-[0_0_15px_rgba(226,238,90,0.5)]"
                : "bg-white/5 border border-[#e2ee5a]/40 text-[#e2ee5a] hover:bg-[#e2ee5a]/10"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLightsOn ? "bg-[#0a0a0c]" : "bg-[#e2ee5a] animate-pulse"
              }`}
            />
            <span>{isLightsOn ? "LIGHTS OFF" : "LIGHTS ON"}</span>
          </button>

          <a
            href={profile.resumePdf}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-[11px] font-mono text-ivory-100 hover:border-[#e2ee5a] hover:text-[#e2ee5a] transition-all"
          >
            <FileText size={12} />
            <span>RESUME</span>
            <ArrowUpRight size={11} />
          </a>

          {/* Admin Lock Icon */}
          <button
            type="button"
            onClick={() => {
              if (isAuthenticated) {
                setIsAdminOpen(true);
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            title={isAuthenticated ? "Open CMS Dashboard" : "Admin CMS Login"}
            aria-label="Admin CMS Portal"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/15 text-ivory-300 hover:border-[#e2ee5a] hover:text-[#e2ee5a] hover:bg-white/10 transition-all cursor-pointer relative"
          >
            <Lock size={12} />
            {isAuthenticated && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#e2ee5a]" />
            )}
          </button>
        </div>

        {/* Mobile Hamburger Toggle (44px min touch target) */}
        <div className="flex md:hidden items-center gap-2">
          {/* Quick Resume Pill on Mobile Header */}
          <a
            href={profile.resumePdf}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-[10px] font-mono text-ivory-200 active:scale-95"
            aria-label="View Resume"
          >
            <FileText size={11} />
            <span>RESUME</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border active:scale-90 ${
              mobileMenuOpen
                ? "bg-[#e2ee5a] text-[#0a0a0c] border-[#e2ee5a] shadow-[0_0_15px_rgba(226,238,90,0.4)]"
                : "bg-white/5 border-white/15 text-ivory-100 hover:border-[#e2ee5a]/60 hover:text-[#e2ee5a]"
            }`}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="md:hidden fixed inset-x-0 top-[60px] bottom-0 bg-[#0a0a0c]/98 backdrop-blur-2xl border-t border-white/10 px-5 py-6 flex flex-col justify-between overflow-y-auto"
            style={{ overscrollBehavior: "contain" }}
          >
            <div>
              {/* Chapter Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="text-[10px] font-mono text-[#e2ee5a] tracking-widest uppercase font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#e2ee5a] inline-block shadow-[0_0_8px_#e2ee5a]" />
                  <span>CHAPTER INDEX // PORTFOLIO</span>
                </div>
                <span className="text-[10px] font-mono text-ivory-400">06 SECTIONS</span>
              </div>

              {/* Navigation Items in Bold Condensed Style */}
              <nav className="flex flex-col divide-y divide-white/5">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => handleNavClick(item.href)}
                    className="flex items-center justify-between py-3.5 group text-left transition-colors active:bg-white/[0.03] px-1"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-[#e2ee5a] font-bold">
                        {item.num}
                      </span>
                      <span className="font-condensed font-extrabold text-2xl text-white group-hover:text-[#e2ee5a] transition-colors uppercase tracking-tight">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ivory-400/60 group-hover:text-ivory-200">
                      {item.sub}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Bottom Actions Tray: Lights, Resume & Admin Access */}
            <div className="pt-6 border-t border-white/10 space-y-3 mt-4">
              {/* Lights Toggle on Mobile */}
              <button
                type="button"
                onClick={toggleLights}
                className={`w-full py-3 rounded-none font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all border ${
                  isLightsOn
                    ? "bg-[#e2ee5a] text-[#0a0a0c] border-[#e2ee5a] shadow-[0_0_20px_rgba(226,238,90,0.3)]"
                    : "bg-white/5 border-white/15 text-[#e2ee5a] hover:bg-[#e2ee5a]/10"
                }`}
              >
                {isLightsOn ? <Sun size={15} /> : <Moon size={15} />}
                <span>{isLightsOn ? "LIGHTS OFF // RESTORE SHADOWS" : "LIGHTS ON // FULL ILLUMINATION"}</span>
              </button>

              {/* Download Resume Full Button */}
              <a
                href={profile.resumePdf}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-white/10 hover:bg-white text-white hover:text-[#0a0a0c] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-white/15"
              >
                <FileText size={14} />
                <span>DOWNLOAD RESUME (PDF)</span>
                <ArrowUpRight size={13} />
              </a>

              {/* Admin Portal Entry on Mobile */}
              <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-ivory-400">
                <span className="text-[10px] text-ivory-400/60 uppercase">AUTHOR: SAI DEEPAK AMBATI</span>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isAuthenticated) {
                      setIsAdminOpen(true);
                    } else {
                      setIsLoginModalOpen(true);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-ivory-400 hover:text-[#e2ee5a] text-[11px] font-mono tracking-wider transition-colors py-1 px-2 border border-white/10 rounded"
                >
                  <Lock size={12} className={isAuthenticated ? "text-[#e2ee5a]" : ""} />
                  <span>{isAuthenticated ? "CMS ACTIVE" : "ADMIN"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
