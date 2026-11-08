import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Calendar, ArrowUpRight, ChevronDown } from "lucide-react";
import { CertificationItem } from "../data";
import { usePortfolioData } from "../context/PortfolioContext";

gsap.registerPlugin(ScrollTrigger);

export function ChapterCertifications() {
  const { certifications } = usePortfolioData();
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);

  const categories = ["ALL", "CLOUD", "AI / ML", "DATA", "BACKEND"];

  const filteredCerts =
    selectedCategory === "ALL"
      ? certifications
      : certifications.filter((c) => c.category === selectedCategory);

  // Monitor scroll state to show subtle top/bottom hints
  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const hasMore = el.scrollHeight > el.clientHeight + 4;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 6;
    const isAtTop = el.scrollTop <= 4;
    setCanScrollDown(hasMore && !isAtBottom);
    setCanScrollUp(!isAtTop);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, selectedCategory, filteredCerts.length]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Headline reveal animation
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // 2. Staggered row reveal for initial view
      const rows = gsap.utils.toArray<HTMLElement>(".cert-row-item");
      if (rows.length > 0) {
        gsap.fromTo(
          rows.slice(0, 3),
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: scrollContainerRef.current,
              start: "top 88%",
              toggleActions: "play none none reverse"
            }
          }
        );
        // Ensure remaining rows are visible when scrolled into view
        rows.slice(3).forEach((r) => {
          gsap.set(r, { opacity: 1, y: 0 });
        });
      }

      // 3. Subtle background watermark parallax
      const watermarks = gsap.utils.toArray<HTMLElement>(".certs-watermark");
      watermarks.forEach((wm) => {
        gsap.to(wm, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [selectedCategory]);

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className="relative py-16 sm:py-20 md:py-24 bg-[#0a0a0c] text-ivory-100 select-none overflow-hidden border-b border-white/10"
    >
      {/* Background Watermark Stencil */}
      <div className="absolute right-[-2%] top-[10%] pointer-events-none select-none z-0 overflow-hidden opacity-10">
        <span className="certs-watermark block font-condensed font-extrabold text-[26vw] leading-none text-transparent tracking-tighter outlined-stencil">
          VERIFIED
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Top Header Badge */}
        <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-[#e2ee5a] uppercase mb-3">
          <span className="w-2.5 h-2.5 bg-[#e2ee5a] inline-block shadow-[0_0_10px_#e2ee5a]" />
          <span className="font-bold">CH. 04 — CERTIFICATIONS</span>
          <span className="text-white/20 font-mono text-xs">//</span>
          <span className="text-ivory-400">VERIFIED ACCREDITATIONS</span>
        </div>

        {/* Master Heading & Category Filter Row */}
        <div
          ref={headlineRef}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/15 mb-4 sm:mb-6"
        >
          <div>
            <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-3xl sm:text-5xl md:text-6xl font-condensed font-extrabold text-white tracking-tight uppercase leading-none">
                CERTIFICATIONS
              </span>
              <span className="text-2xl sm:text-4xl md:text-5xl font-serif italic font-normal text-[#e2ee5a] leading-none">
                &amp; credentials.
              </span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-ivory-400 font-sans max-w-xl">
              Industry credentials validating applied proficiencies across Cloud, Databases, Generative AI, Full-Stack, and Python.
            </p>
          </div>

          {/* Compact Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 self-start lg:self-end">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer select-none rounded-none border ${
                  selectedCategory === cat
                    ? "bg-[#e2ee5a] text-[#0a0a0c] border-[#e2ee5a] shadow-[0_0_12px_rgba(226,238,90,0.35)]"
                    : "bg-white/5 text-ivory-300 border-white/10 hover:border-white/25 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Fixed-Height Scrollable Certification List (Displays ~3 rows initially) */}
        <div className="relative border-t border-b border-white/10">
          {/* Subtle Top Gradient Fade when user scrolls down */}
          {canScrollUp && (
            <div
              className="pointer-events-none absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-[#0a0a0c] to-transparent z-10 transition-opacity duration-200"
              aria-hidden="true"
            />
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            tabIndex={0}
            role="region"
            aria-label="Scrollable certifications list"
            className="editorial-scrollbar max-h-[225px] sm:max-h-[235px] md:max-h-[240px] overflow-y-auto overflow-x-hidden divide-y divide-white/10 focus:outline-none focus:ring-1 focus:ring-[#e2ee5a]/30 pr-1 sm:pr-2 select-text"
            style={{ touchAction: "pan-y" }}
          >
            {filteredCerts.map((cert, idx) => {
              const hasLink = Boolean(cert.link);

              const RowWrapper = hasLink ? "a" : "div";
              const rowProps = hasLink
                ? {
                    href: cert.link,
                    target: "_blank",
                    rel: "noreferrer"
                  }
                : {};

              return (
                <RowWrapper
                  key={cert.id}
                  {...rowProps}
                  className="cert-row-item group py-3.5 sm:py-4 md:py-4.5 px-2 sm:px-4 hover:bg-white/[0.03] transition-colors duration-200 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-6 block"
                >
                  {/* Left Side: Number, Prominent Name, and Elegant Supporting Details */}
                  <div className="flex items-start sm:items-center gap-3 sm:gap-5 flex-1 min-w-0">
                    {/* Number Badge */}
                    <span className="font-mono text-xs font-bold text-[#e2ee5a] shrink-0 pt-0.5 sm:pt-0">
                      {cert.number || `0${idx + 1}`}
                    </span>

                    {/* Certification Title & Issuer Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-condensed font-extrabold text-base sm:text-lg md:text-xl lg:text-[22px] text-white tracking-tight uppercase group-hover:text-[#e2ee5a] transition-colors leading-tight">
                          {cert.title}
                        </h3>
                        {hasLink && (
                          <ArrowUpRight
                            size={14}
                            className="text-[#e2ee5a] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          />
                        )}
                      </div>

                      <div className="font-serif italic text-xs sm:text-sm text-ivory-400 mt-0.5 flex flex-wrap items-center gap-x-2">
                        <span className="text-ivory-300 font-medium not-italic font-sans text-xs">
                          {cert.issuer}
                        </span>
                        {cert.domain && (
                          <>
                            <span className="text-white/20">·</span>
                            <span className="text-ivory-400/80">{cert.domain}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Category Label, Year, and Verified Seal */}
                  <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-5 shrink-0 pl-7 sm:pl-0 pt-1 md:pt-0">
                    {/* Category Pill */}
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] font-mono tracking-wider uppercase text-ivory-300">
                      {cert.category}
                    </span>

                    {/* Year */}
                    <span className="text-xs font-mono text-ivory-400 flex items-center gap-1 min-w-[50px]">
                      <Calendar size={11} className="text-[#e2ee5a]" />
                      <span>{cert.year}</span>
                    </span>

                    {/* Verified Credential Indicator */}
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#e2ee5a]/10 border border-[#e2ee5a]/30 text-[#e2ee5a] text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
                      <ShieldCheck size={12} className="text-[#e2ee5a]" />
                      <span>VERIFIED</span>
                    </div>
                  </div>
                </RowWrapper>
              );
            })}
          </div>

          {/* Subtle Bottom Gradient Fade when more items are available */}
          {canScrollDown && (
            <div
              className="pointer-events-none absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#0a0a0c] to-transparent z-10 transition-opacity duration-200"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Compact Footer Lead-in & Scroll Availability Indicator */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-ivory-400/60">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#e2ee5a]" />
            <span>04 // {filteredCerts.length} CREDENTIALS IN ARCHIVE</span>
            {canScrollDown && (
              <span className="inline-flex items-center gap-1 text-[#e2ee5a] text-[10px] uppercase font-bold tracking-wider ml-2 animate-pulse">
                <ChevronDown size={12} />
                <span>SCROLL TO VIEW MORE</span>
              </span>
            )}
          </div>
          <a
            href="#journey"
            className="hover:text-[#e2ee5a] transition-colors flex items-center gap-1 text-ivory-300 font-medium"
          >
            <span>PROCEED TO MY JOURNEY (CH. 05)</span>
            <span className="text-[#e2ee5a]">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
