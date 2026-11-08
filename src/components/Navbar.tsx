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
  const [activeSection, setActiveSection] = useState("#subject");

  // Track scroll position for header background elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Minimal, unnumbered navigation items matching editorial guidelines
  const navItems = [
    { label: "SUBJECT", href: "#subject" },
    { label: "CASE FILES", href: "#case-files" },
    { label: "TOOLKIT", href: "#toolkit" },
    { label: "CERTIFICATIONS", href: "#certifications" },
    { label: "JOURNEY", href: "#journey" },
    { label: "HIRE ME", href: "#hire-me" }
  ];

  // Active section tracking for precise visual indicator
  useEffect(() => {
    const handleActiveScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (const item of navItems) {
        const el = document.querySelector(item.href);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          const height = el.getBoundingClientRect().height;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(item.href);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleActiveScroll, { passive: true });
    handleActiveScroll();
    return () => window.removeEventListener("scroll", handleActiveScroll);
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

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setActiveSection(href);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? "bg-[#0a0a0c]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          : "bg-gradient-to-b from-[#0a0a0c]/85 via-[#0a0a0c]/40 to-transparent py-4 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Monogram Brand / Logo */}
        <a
          href="#subject"
          className="flex items-center gap-3.5 text-white group select-none shrink-0"
          aria-label="Sai Deepak Ambati Portfolio"
          onClick={() => {
            setMobileMenuOpen(false);
            setActiveSection("#subject");
          }}
        >
          {/* Yellow Monogram Box */}
          <span className="font-mono font-extrabold text-xs sm:text-sm tracking-widest text-[#0a0a0c] bg-[#e2ee5a] px-2.5 py-1 shadow-[0_0_18px_rgba(226,238,90,0.35)] group-hover:bg-white group-hover:text-[#0a0a0c] transition-colors">
            {profile.initials}
          </span>
          <div className="flex flex-col">
            <span className="font-condensed font-extrabold text-sm sm:text-[15px] text-white tracking-[0.08em] uppercase leading-none group-hover:text-[#e2ee5a] transition-colors">
              SAI DEEPAK
            </span>
            <span className="text-[9px] font-mono text-zinc-400/70 tracking-[0.22em] uppercase leading-tight mt-1">
              PORTFOLIO IN SIX CHAPTERS
            </span>
          </div>
        </a>

        {/* Center Minimal Navigation (Desktop: Laptops & Wide Displays) */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {navItems.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`group relative py-1 text-xs font-mono font-medium tracking-[0.18em] uppercase transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? "text-[#e2ee5a] font-bold"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                <span className="relative z-10 group-hover:text-[#e2ee5a] transition-colors duration-200">
                  {item.label}
                </span>

                {/* Active & Hover Underline Indicator */}
                {isActive ? (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#e2ee5a] shadow-[0_0_10px_rgba(226,238,90,0.7)] transition-all duration-300"
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#e2ee5a] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left opacity-70"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Controls (Desktop: >= 1024px): Lights, Resume & Admin Lock */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {/* Desktop LIGHTS ON / OFF Toggle */}
          <button
            type="button"
            onClick={toggleLights}
            aria-label={isLightsOn ? "Switch to Lights Off" : "Switch to Lights On"}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer h-8 select-none border ${
              isLightsOn
                ? "bg-[#e2ee5a] text-[#0a0a0c] border-[#e2ee5a] shadow-[0_0_18px_rgba(226,238,90,0.45)]"
                : "bg-white/5 border-white/15 text-zinc-300 hover:border-[#e2ee5a]/60 hover:text-[#e2ee5a] hover:bg-white/10"
            }`}
          >
            {isLightsOn ? <Sun size={13} /> : <Moon size={13} />}
            <span className="whitespace-nowrap">{isLightsOn ? "LIGHTS OFF" : "LIGHTS ON"}</span>
          </button>

          {/* Resume Pill Button */}
          <a
            href={profile.resumePdf}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-[11px] font-mono font-bold text-zinc-200 hover:border-[#e2ee5a] hover:text-[#e2ee5a] hover:bg-white/10 transition-all h-8 active:scale-95 whitespace-nowrap select-none"
          >
            <FileText size={12} />
            <span>RESUME</span>
            <ArrowUpRight size={11} className="opacity-70" />
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
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/15 text-zinc-400 hover:border-[#e2ee5a] hover:text-[#e2ee5a] hover:bg-white/10 transition-all cursor-pointer relative active:scale-95 shrink-0"
          >
            <Lock size={12} />
            {isAuthenticated && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#e2ee5a] shadow-[0_0_6px_#e2ee5a]" />
            )}
          </button>
        </div>

        {/* Mobile / Tablet Controls (< 1024px) */}
        <div className="flex lg:hidden items-center gap-2.5">
          {/* Quick Resume Pill on Mobile Header */}
          <a
            href={profile.resumePdf}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-[10px] font-mono font-bold text-zinc-200 hover:text-[#e2ee5a] hover:border-[#e2ee5a] active:scale-95 transition-all"
            aria-label="View Resume"
          >
            <FileText size={11} />
            <span>RESUME</span>
          </a>

          {/* Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border active:scale-90 ${
              mobileMenuOpen
                ? "bg-[#e2ee5a] text-[#0a0a0c] border-[#e2ee5a] shadow-[0_0_15px_rgba(226,238,90,0.4)]"
                : "bg-white/5 border-white/15 text-zinc-100 hover:border-[#e2ee5a]/60 hover:text-[#e2ee5a]"
            }`}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
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
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="lg:hidden fixed inset-x-0 top-[58px] bottom-0 bg-[#0a0a0c]/98 backdrop-blur-2xl border-t border-white/10 px-5 py-6 flex flex-col justify-between overflow-y-auto"
            style={{ overscrollBehavior: "contain" }}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="text-[10px] font-mono text-[#e2ee5a] tracking-widest uppercase font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#e2ee5a] inline-block shadow-[0_0_8px_#e2ee5a]" />
                  <span>NAVIGATION DIRECTORY</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">06 SECTIONS</span>
              </div>

              {/* Navigation Items (Unnumbered, Editorial Typography) */}
              <nav className="flex flex-col divide-y divide-white/5">
                {navItems.map((item) => {
                  const isActive = activeSection === item.href;
                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => handleNavClick(item.href)}
                      className={`flex items-center justify-between py-4 group text-left transition-colors active:bg-white/[0.03] px-2 ${
                        isActive ? "bg-white/[0.02]" : ""
                      }`}
                    >
                      <span
                        className={`font-condensed font-extrabold text-2xl uppercase tracking-tight transition-colors ${
                          isActive ? "text-[#e2ee5a]" : "text-white group-hover:text-[#e2ee5a]"
                        }`}
                      >
                        {item.label}
                      </span>
                      {isActive ? (
                        <span className="font-mono text-[10px] text-[#e2ee5a] tracking-widest uppercase flex items-center gap-1.5 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#e2ee5a] shadow-[0_0_6px_#e2ee5a]" />
                          <span>ACTIVE</span>
                        </span>
                      ) : (
                        <ArrowUpRight
                          size={16}
                          className="text-zinc-500 group-hover:text-[#e2ee5a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Controls Tray: Lights, Resume & Admin Access */}
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
              <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-zinc-400">
                <span className="text-[10px] text-zinc-500 uppercase">AUTHOR: SAI DEEPAK AMBATI</span>
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
                  className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-[#e2ee5a] text-[11px] font-mono tracking-wider transition-colors py-1 px-2 border border-white/10 rounded"
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
