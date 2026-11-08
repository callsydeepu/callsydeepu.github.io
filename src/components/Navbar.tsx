import React, { useState, useEffect } from "react";
import { ArrowUpRight, FileText, Lock, Sun, Moon } from "lucide-react";
import { profile } from "../data";
import { usePortfolioData } from "../context/PortfolioContext";

export function Navbar() {
  const { isAuthenticated, setIsAdminOpen, setIsLoginModalOpen, isLightsOn, toggleLights } =
    usePortfolioData();
  const [scrolled, setScrolled] = useState(false);
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

  const handleNavClick = (href: string) => {
    setActiveSection(href);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0c]/90 backdrop-blur-md border-b border-white/10 py-2.5 sm:py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          : "bg-gradient-to-b from-[#0a0a0c]/85 via-[#0a0a0c]/40 to-transparent py-3 sm:py-4 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 w-full flex items-center justify-between gap-3 sm:gap-6 lg:gap-8 xl:gap-12">
        {/* 1. Left: Brand / Logo Section */}
        <div className="flex items-center justify-start shrink-0">
          <a
            href="#subject"
            className="flex items-center gap-2 sm:gap-3 text-white group select-none shrink-0"
            aria-label="Sai Deepak Ambati Portfolio"
            onClick={() => setActiveSection("#subject")}
          >
            {/* Yellow Monogram Box */}
            <span className="inline-flex items-center justify-center font-mono font-extrabold text-[11px] sm:text-xs xl:text-[13px] tracking-widest text-[#0a0a0c] bg-[#e2ee5a] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[2px] shadow-[0_0_16px_rgba(226,238,90,0.35)] group-hover:bg-white group-hover:text-[#0a0a0c] transition-colors shrink-0">
              {profile.initials}
            </span>
            <div className="flex flex-col justify-center">
              <span className="font-condensed font-extrabold text-xs sm:text-sm xl:text-[15px] text-white tracking-[0.06em] sm:tracking-[0.08em] uppercase leading-tight group-hover:text-[#e2ee5a] transition-colors">
                SAI DEEPAK
              </span>
              <span className="hidden xs:block text-[8px] sm:text-[9px] font-mono text-zinc-400/80 tracking-[0.16em] sm:tracking-[0.2em] uppercase leading-none mt-0.5 sm:mt-1">
                PORTFOLIO IN SIX CHAPTERS
              </span>
            </div>
          </a>
        </div>

        {/* 2. Center: Minimal Navigation Links Group (Desktop Only >= 1024px) */}
        <nav className="hidden lg:flex items-center justify-center gap-4 xl:gap-6 2xl:gap-7 shrink-0">
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
                className={`group relative inline-flex flex-col items-center justify-center py-1.5 px-1 text-[11px] xl:text-xs font-mono font-medium tracking-[0.14em] xl:tracking-[0.18em] uppercase transition-colors duration-200 whitespace-nowrap shrink-0 ${
                  isActive
                    ? "text-[#e2ee5a] font-bold"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                <span className="relative z-10 group-hover:text-[#e2ee5a] transition-colors duration-200">
                  {item.label}
                </span>

                {/* Active & Hover Underline Indicator Centered */}
                {isActive ? (
                  <span
                    className="absolute bottom-0 inset-x-0 h-[2px] bg-[#e2ee5a] shadow-[0_0_10px_rgba(226,238,90,0.7)] rounded-full transition-all duration-300"
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className="absolute bottom-0 inset-x-0 h-[1.5px] bg-[#e2ee5a] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center rounded-full opacity-70"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* 3. Right: Action Controls (Desktop + Mobile in single clean row) */}
        <div className="flex items-center justify-end shrink-0">
          {/* Desktop Controls (>= 1024px): Lights, Resume & Admin Lock */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
            {/* Desktop LIGHTS ON / OFF Toggle */}
            <button
              type="button"
              onClick={toggleLights}
              aria-label={isLightsOn ? "Switch to Lights Off" : "Switch to Lights On"}
              className={`inline-flex items-center gap-1.5 xl:gap-2 px-3 xl:px-3.5 py-1.5 rounded-full text-[10.5px] xl:text-[11px] font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer h-8 select-none border shrink-0 ${
                isLightsOn
                  ? "bg-[#e2ee5a] text-[#0a0a0c] border-[#e2ee5a] shadow-[0_0_18px_rgba(226,238,90,0.45)]"
                  : "bg-white/5 border-white/15 text-zinc-300 hover:border-[#e2ee5a]/60 hover:text-[#e2ee5a] hover:bg-white/10"
              }`}
            >
              {isLightsOn ? <Sun size={12.5} /> : <Moon size={12.5} />}
              <span className="whitespace-nowrap">{isLightsOn ? "LIGHTS OFF" : "LIGHTS ON"}</span>
            </button>

            {/* Desktop Resume Pill Button */}
            <a
              href={profile.resumePdf}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 xl:px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-[10.5px] xl:text-[11px] font-mono font-bold text-zinc-200 hover:border-[#e2ee5a] hover:text-[#e2ee5a] hover:bg-white/10 transition-all h-8 active:scale-95 whitespace-nowrap select-none shrink-0"
            >
              <FileText size={12} />
              <span>RESUME</span>
              <ArrowUpRight size={11} className="opacity-70" />
            </a>

            {/* Desktop Admin Lock Icon */}
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

          {/* Mobile Controls (< 1024px): Clean, Minimal Single Row (Lights Toggle + Resume, No Admin Lock, No Hamburger) */}
          <div className="flex lg:hidden items-center gap-1.5 xs:gap-2 shrink-0">
            {/* Mobile LIGHTS ON / OFF Toggle */}
            <button
              type="button"
              onClick={toggleLights}
              aria-label={isLightsOn ? "Switch to Lights Off" : "Switch to Lights On"}
              className={`inline-flex items-center gap-1 xs:gap-1.5 px-2 xs:px-2.5 py-1 rounded-full text-[9.5px] xs:text-[10px] font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer h-7 xs:h-7.5 select-none border shrink-0 ${
                isLightsOn
                  ? "bg-[#e2ee5a] text-[#0a0a0c] border-[#e2ee5a] shadow-[0_0_12px_rgba(226,238,90,0.4)]"
                  : "bg-white/5 border-white/15 text-zinc-300 hover:border-[#e2ee5a]/60 hover:text-[#e2ee5a]"
              }`}
            >
              {isLightsOn ? <Sun size={11} /> : <Moon size={11} />}
              <span className="whitespace-nowrap">{isLightsOn ? "LIGHTS OFF" : "LIGHTS ON"}</span>
            </button>

            {/* Mobile Resume Pill Button */}
            <a
              href={profile.resumePdf}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2 xs:px-2.5 py-1 rounded-full bg-white/5 border border-white/15 text-[9.5px] xs:text-[10px] font-mono font-bold text-zinc-200 hover:text-[#e2ee5a] hover:border-[#e2ee5a] transition-all h-7 xs:h-7.5 active:scale-95 whitespace-nowrap select-none shrink-0"
              aria-label="View Resume"
            >
              <FileText size={10.5} />
              <span>RESUME</span>
              <ArrowUpRight size={9.5} className="opacity-70 hidden xs:inline-block" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
