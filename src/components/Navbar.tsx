import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, FileText, Lock } from "lucide-react";
import { profile } from "../data";
import { usePortfolioData } from "../context/PortfolioContext";

export function Navbar() {
  const { isAuthenticated, setIsAdminOpen, setIsLoginModalOpen } = usePortfolioData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLightsOn, setIsLightsOn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { label: "01 Subject", href: "#subject" },
    { label: "02 Case Files", href: "#case-files" },
    { label: "03 Toolkit", href: "#toolkit" },
    { label: "04 Certs", href: "#certifications" },
    { label: "05 Journey", href: "#journey" },
    { label: "06 Hire Me", href: "#hire-me" }
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0c]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-xl"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Monogram Brand */}
        <a
          href="#subject"
          className="flex items-center gap-3 text-white group"
          aria-label="Sai Deepak Ambati Portfolio"
        >
          <span className="font-mono font-bold text-sm tracking-widest text-[#e2ee5a] group-hover:scale-105 transition-transform">
            {profile.initials}
          </span>
          <span className="hidden sm:inline text-[11px] font-mono text-ivory-400/80 tracking-widest uppercase">
            A PORTFOLIO IN SIX CHAPTERS
          </span>
        </a>

        {/* Center Chapter Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-[11px] font-mono tracking-wider text-ivory-300">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[#e2ee5a] transition-colors uppercase py-1"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Actions: Lights Toggle & Resume */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Small LIGHTS ON / OFF Toggle in top-right nav */}
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

          {/* Small Lock Icon Entrypoint Immediately Beside RESUME */}
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

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden w-8 h-8 rounded-lg bg-ink-850 border border-white/10 flex items-center justify-center text-ivory-200 hover:text-white"
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0e0e12] border-b border-white/15 px-6 py-6 space-y-4"
          >
            <div className="text-[10px] font-mono text-[#e2ee5a] tracking-widest uppercase mb-2">
              A PORTFOLIO IN SIX CHAPTERS
            </div>
            <nav className="flex flex-col gap-3 text-xs font-mono text-ivory-200">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#e2ee5a] transition-colors py-1.5 border-b border-white/5 pb-2 uppercase"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="pt-2">
              <a
                href={profile.resumePdf}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#e2ee5a] text-[#0a0a0c] font-mono font-bold text-xs"
              >
                <FileText size={13} />
                <span>DOWNLOAD RESUME (PDF)</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
