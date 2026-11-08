import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { profile as defaultProfile } from "../data";
import { usePortfolioData } from "../context/PortfolioContext";

gsap.registerPlugin(ScrollTrigger);

export function HeroSubject() {
  const { bio, isLightsOn } = usePortfolioData();
  const profile = { ...defaultProfile, ...bio };

  const heroRef = useRef<HTMLElement>(null);
  const initialsRef = useRef<HTMLDivElement>(null);
  const yellowPanelRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);

  // Coordinates for smooth cursor/touch-following spotlight
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  // Set initial resting spotlight position at portrait center
  useEffect(() => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const defaultX = rect.width * 0.65;
    const defaultY = rect.height * 0.42;
    mousePos.current = { x: defaultX, y: defaultY };
    currentPos.current = { x: defaultX, y: defaultY };
    heroRef.current.style.setProperty("--spot-x", `${defaultX.toFixed(1)}px`);
    heroRef.current.style.setProperty("--spot-y", `${defaultY.toFixed(1)}px`);
  }, []);

  // Smooth spotlight movement interpolation with natural glide
  const updateSpotlight = useCallback(() => {
    if (!heroRef.current) return;

    currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.18;
    currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.18;

    heroRef.current.style.setProperty("--spot-x", `${currentPos.current.x.toFixed(1)}px`);
    heroRef.current.style.setProperty("--spot-y", `${currentPos.current.y.toFixed(1)}px`);

    rafId.current = requestAnimationFrame(updateSpotlight);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(updateSpotlight);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateSpotlight]);

  // High-performance native touch listeners for mobile & tablet devices
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const onTouchStart = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = heroEl.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;

      // Prevent jumping: align current and target position instantly on first touch
      mousePos.current = { x, y };
      currentPos.current = { x, y };
      heroEl.style.setProperty("--spot-x", `${x.toFixed(1)}px`);
      heroEl.style.setProperty("--spot-y", `${y.toFixed(1)}px`);

      setIsHovered(true);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = heroEl.getBoundingClientRect();
      // Update target coordinates without triggering React state updates
      mousePos.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    };

    const onTouchEnd = () => {
      setIsHovered(false);
    };

    // Passive listeners allow fluid vertical scrolling without blockage
    heroEl.addEventListener("touchstart", onTouchStart, { passive: true });
    heroEl.addEventListener("touchmove", onTouchMove, { passive: true });
    heroEl.addEventListener("touchend", onTouchEnd, { passive: true });
    heroEl.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      heroEl.removeEventListener("touchstart", onTouchStart);
      heroEl.removeEventListener("touchmove", onTouchMove);
      heroEl.removeEventListener("touchend", onTouchEnd);
      heroEl.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  // Desktop Pointer / Mouse Event Handlers
  const handlePointerEnter = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return; // Touch handled by native listeners
    setIsHovered(true);
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePos.current = { x, y };
    currentPos.current = { x, y };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    setIsHovered(false);
  };

  // GSAP Cinematic Entrance Sequence & Coordinated Scroll Parallax
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const staggerEls = heroEl.querySelectorAll<HTMLElement>(".hero-stagger");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          // Ensure all hero elements are firmly at resting state once entrance finishes
          if (staggerEls && staggerEls.length > 0) {
            gsap.set(staggerEls, { opacity: 1, y: 0, clearProps: "transform" });
          }
        }
      });

      // 1. Initials entrance (opacity + scale)
      if (initialsRef.current) {
        tl.fromTo(
          initialsRef.current,
          { opacity: 0, scale: 0.92 },
          { opacity: 0.45, scale: 1, duration: 1.3, ease: "power2.out" }
        );
      }

      // 2. Yellow Panel reveal (Desktop)
      if (yellowPanelRef.current) {
        tl.fromTo(
          yellowPanelRef.current,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 1.1, ease: "power2.out" },
          "-=1.0"
        );
      }

      // 3. Portrait smooth upward reveal (Desktop)
      if (portraitRef.current) {
        tl.fromTo(
          portraitRef.current,
          { opacity: 0, y: 55, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" },
          "-=0.9"
        );
      }

      // 4. Staggered text & metadata entrance
      if (staggerEls && staggerEls.length > 0) {
        tl.fromTo(
          staggerEls,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.07,
            ease: "power2.out"
          },
          "-=0.9"
        );
      }

      // 5. Scroll-driven cinematic parallax exit towards Chapter 01
      if (!prefersReducedMotion) {
        if (initialsRef.current) {
          gsap.fromTo(
            initialsRef.current,
            { yPercent: 0 },
            {
              yPercent: -22,
              ease: "none",
              immediateRender: false,
              scrollTrigger: {
                trigger: heroEl,
                start: "top top",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
                onLeaveBack: () => {
                  if (initialsRef.current) gsap.set(initialsRef.current, { yPercent: 0 });
                }
              }
            }
          );
        }

        if (yellowPanelRef.current) {
          gsap.fromTo(
            yellowPanelRef.current,
            { yPercent: 0 },
            {
              yPercent: -15,
              ease: "none",
              immediateRender: false,
              scrollTrigger: {
                trigger: heroEl,
                start: "top top",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
                onLeaveBack: () => {
                  if (yellowPanelRef.current) gsap.set(yellowPanelRef.current, { yPercent: 0 });
                }
              }
            }
          );
        }

        if (portraitRef.current) {
          gsap.fromTo(
            portraitRef.current,
            { yPercent: 0 },
            {
              yPercent: -8,
              ease: "none",
              immediateRender: false,
              scrollTrigger: {
                trigger: heroEl,
                start: "top top",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
                onLeaveBack: () => {
                  if (portraitRef.current) gsap.set(portraitRef.current, { yPercent: 0 });
                }
              }
            }
          );
        }

        // Hero text exit parallax: Fades gently as user scrolls down toward Chapter 01,
        // but reliably restores full opacity and position whenever returning to top
        if (staggerEls && staggerEls.length > 0) {
          gsap.fromTo(
            staggerEls,
            { opacity: 1, y: 0 },
            {
              opacity: 0.25,
              y: -22,
              stagger: 0.02,
              ease: "none",
              immediateRender: false,
              scrollTrigger: {
                trigger: heroEl,
                start: "top top",
                end: "bottom 20%",
                scrub: 0.4,
                invalidateOnRefresh: true,
                onLeaveBack: () => {
                  // Scrolling all the way back up: restore 100% full opacity immediately
                  gsap.to(staggerEls, {
                    opacity: 1,
                    y: 0,
                    duration: 0.2,
                    ease: "power1.out",
                    overwrite: "auto"
                  });
                },
                onEnterBack: () => {
                  // Scrolling up back into hero
                  gsap.to(staggerEls, {
                    opacity: 1,
                    y: 0,
                    duration: 0.2,
                    ease: "power1.out",
                    overwrite: "auto"
                  });
                },
                onRefresh: (self) => {
                  // When ScrollTrigger recalculates or after layout shifts:
                  // if user is at or near the top, force full visibility
                  if (self.progress === 0 || window.scrollY < 60) {
                    gsap.set(staggerEls, { opacity: 1, y: 0 });
                  }
                }
              }
            }
          );
        }
      }
    }, heroEl);

    // Initial spotlight centered on the portrait / hero right side
    const rect = heroEl.getBoundingClientRect();
    const initialX = rect.width > 768 ? rect.width * 0.72 : rect.width * 0.5;
    const initialY = rect.height > 768 ? rect.height * 0.48 : rect.height * 0.38;
    currentPos.current = { x: initialX, y: initialY };
    mousePos.current = { x: initialX, y: initialY };
    heroEl.style.setProperty("--spot-x", `${initialX}px`);
    heroEl.style.setProperty("--spot-y", `${initialY}px`);

    // Top-of-page scroll listener to ensure hero text is never left invisible
    const handleScrollSafety = () => {
      if (window.scrollY < 40 && staggerEls && staggerEls.length > 0) {
        staggerEls.forEach((el) => {
          const compOpacity = parseFloat(window.getComputedStyle(el).opacity);
          if (compOpacity < 0.9) {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.2, overwrite: "auto" });
          }
        });
      }
    };
    window.addEventListener("scroll", handleScrollSafety, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollSafety);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="subject"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="relative min-h-screen min-h-[100vh] min-h-[100svh] hero-viewport-height w-full pt-20 sm:pt-28 lg:pt-32 pb-8 sm:pb-8 lg:pb-10 flex flex-col justify-between overflow-hidden bg-[#111111] select-none"
      style={{ touchAction: "pan-y" }}
    >
      {/* 1. LAYER 1: ENORMOUS OUTLINED INITIALS (BEHIND PORTRAIT & YELLOW PANEL) */}
      <div
        ref={initialsRef}
        className="absolute right-[-2%] sm:right-[1%] md:right-[3%] lg:right-[4%] top-[8%] bottom-[2%] flex items-center justify-end pointer-events-none select-none z-10 overflow-visible opacity-30 sm:opacity-35"
      >
        <span
          className="font-condensed font-extrabold text-[62vw] sm:text-[42vw] md:text-[34vw] lg:text-[29vw] xl:text-[27vw] leading-none text-transparent tracking-tighter select-none drop-shadow-[0_0_50px_rgba(255,255,255,0.04)]"
          style={{
            WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.18)"
          }}
        >
          {profile.heroInitials}
        </span>
      </div>

      {/* 2. LAYER 2: BRIGHT YELLOW BACKGROUND RECTANGULAR PANEL (DESKTOP ONLY) */}
      <div
        ref={yellowPanelRef}
        className="hidden lg:block absolute right-12 sm:right-16 lg:right-20 xl:right-28 2xl:right-36 top-[15vh] xl:top-[16vh] w-[340px] xl:w-[420px] 2xl:w-[480px] h-[52vh] xl:h-[55vh] max-h-[560px] 2xl:max-h-[620px] bg-[#e2ee5a] z-15 pointer-events-none rounded-none transition-all duration-700"
        style={{
          boxShadow:
            isLightsOn || isHovered
              ? "0 0 90px rgba(226, 238, 90, 0.40)"
              : "0 0 45px rgba(226, 238, 90, 0.12)"
        }}
      />

      {/* 3. LAYER 3: LARGE NATURALLY ISOLATED CUTOUT PORTRAIT (DESKTOP ONLY) */}
      <div
        ref={portraitRef}
        className="hidden lg:flex absolute right-[-20px] lg:right-0 xl:right-[2%] 2xl:right-[5%] bottom-[-45px] xl:bottom-[-55px] 2xl:bottom-[-65px] z-20 pointer-events-none items-end justify-center"
      >
        <picture>
          <source srcSet={profile.portraitCutout} type="image/webp" />
          <img
            src={profile.portraitCutoutPng || profile.portraitJpg}
            alt="Sai Deepak Ambati"
            className="h-[84vh] xl:h-[88vh] 2xl:h-[92vh] max-h-[860px] xl:max-h-[940px] 2xl:max-h-[1040px] w-auto aspect-[1696/1580] object-contain object-bottom select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)] transition-all duration-700"
            style={{
              filter:
                isLightsOn || isHovered
                  ? "contrast(112%) brightness(102%) drop-shadow(0 0 30px rgba(255,255,255,0.14))"
                  : "contrast(105%) brightness(82%) grayscale(20%)"
            }}
            loading="eager"
          />
        </picture>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full relative z-32 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* LEFT COLUMN: Editorial Subject Details */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* FIG. 01 — THE SUBJECT badge */}
            <div className="hero-stagger flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-ivory-300">
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#e24a4a] inline-block" />
                <span>FIG. 01 — THE SUBJECT</span>
              </div>
              <span className="text-white/20 font-mono text-xs">//</span>
              <div className="px-2 py-0.5 bg-[#e2ee5a] text-[#0a0a0c] font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                {profile.primaryLanguage}
              </div>
            </div>

            {/* Interactive Spotlight Prompt Indicator */}
            <div className="hero-stagger flex items-center gap-2 my-1.5 sm:my-2 text-[10px] sm:text-[11px] font-mono tracking-widest text-[#e2ee5a] uppercase">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#e2ee5a] shadow-[0_0_8px_#e2ee5a] animate-ping" />
              <span>
                {isLightsOn
                  ? "● LIGHTS ACTIVE // FULL SYSTEM ILLUMINATED"
                  : isHovered
                  ? "● SPOTLIGHT ACTIVE // DRAG OR MOVE TO INSPECT"
                  : "● AMBIENT MODE // TOUCH OR MOVE CURSOR"}
              </span>
            </div>

            {/* Name Heading in Bold Condensed Typography */}
            <div className="hero-stagger mt-1 sm:mt-2 mb-2 sm:mb-3">
              <div className="text-[11px] sm:text-sm font-mono tracking-[0.25em] uppercase text-ivory-400 mb-1">
                {profile.kicker}
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[100px] xl:text-[108px] font-condensed font-extrabold tracking-tight text-white leading-[0.92] uppercase">
                {profile.displayName}
              </h1>
            </div>

            {/* Professional Positioning */}
            <div className="hero-stagger">
              <div className="text-base sm:text-xl md:text-2xl lg:text-3xl font-serif italic text-[#e2ee5a] leading-tight mb-3 sm:mb-4">
                {profile.positioning}
              </div>
            </div>

            {/* MOBILE DEDICATED PORTRAIT COMPOSITION (VISIBLE ON MOBILE/TABLET, HIDDEN ON DESKTOP) */}
            <div className="block lg:hidden my-4 sm:my-6 relative w-full max-w-[280px] xs:max-w-[310px] sm:max-w-[360px] mx-auto">
              {/* Yellow background panel with accent glow */}
              <div
                className="absolute inset-x-3 top-4 bottom-0 bg-[#e2ee5a] z-10 pointer-events-none transition-all duration-500 shadow-[0_0_35px_rgba(226,238,90,0.3)]"
              />
              {/* Portrait Cutout Picture */}
              <picture className="relative z-20 flex justify-center items-end">
                <source srcSet={profile.portraitCutout} type="image/webp" />
                <img
                  src={profile.portraitCutoutPng || profile.portraitJpg}
                  alt="Sai Deepak Ambati"
                  className="w-full h-auto max-h-[340px] sm:max-h-[420px] aspect-[1696/1580] object-contain object-bottom select-none pointer-events-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
                  style={{
                    filter: isLightsOn ? "contrast(108%) brightness(100%)" : "contrast(105%) brightness(92%)"
                  }}
                  loading="eager"
                />
              </picture>
              {/* Corner verified badge on mobile */}
              <div className="absolute bottom-2 left-2 z-25 px-2 py-0.5 bg-[#0a0a0c] text-[#e2ee5a] font-mono text-[9px] font-bold uppercase tracking-wider border border-[#e2ee5a]/40">
                SD // VERIFIED
              </div>
            </div>

            {/* Thin Horizontal Divider Line */}
            <div className="hero-stagger w-full max-w-xl h-[1px] bg-white/15 my-2.5 sm:my-3" />

            {/* Short Professional Introduction */}
            <div className="hero-stagger max-w-xl">
              <p className="text-xs sm:text-sm md:text-base font-sans text-ivory-300 leading-relaxed">
                {profile.summary}
              </p>
            </div>

            {/* Subtle Editorial Metadata Row */}
            <div className="hero-stagger flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-1.5 mt-4 sm:mt-5 text-[10px] sm:text-[11px] font-mono text-ivory-400 uppercase tracking-wider">
              <span>LOC: {profile.location.split(",")[0]}</span>
              <span className="text-white/20">•</span>
              <span>ROLE: AI & SYSTEMS</span>
              <span className="text-white/20">•</span>
              <span className="text-[#e2ee5a] font-bold">ACTIVE 2026</span>
            </div>

            {/* CTA Buttons (Touch-Optimized for Mobile) */}
            <div className="hero-stagger flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              <a
                href="#case-files"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 rounded-none bg-[#e2ee5a] text-[#0a0a0c] font-mono text-xs font-bold tracking-wider uppercase hover:bg-white hover:text-black transition-all shadow-[0_0_25px_rgba(226,238,90,0.3)] active:scale-95 text-center min-h-[44px]"
              >
                <span>EXPLORE CASE FILES</span>
                <ArrowDown size={14} />
              </a>

              <a
                href="#hire-me"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 rounded-none bg-black/80 text-white border border-white/20 font-mono text-xs font-bold tracking-wider uppercase hover:border-[#e2ee5a] hover:text-[#e2ee5a] transition-all active:scale-95 text-center min-h-[44px]"
              >
                <span>PULL ME INTO YOUR TEAM</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          {/* Desktop Right Spacer to preserve 7/5 grid rhythm */}
          <div className="hidden lg:block lg:col-span-5 pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      {/* 3. LIGHTS OFF / ON INTERACTIVE SPOTLIGHT MASK (RESPONSIVE FOR TOUCH AND DESKTOP) */}
      
      {/* Ambient resting mask when not hovered and lights off */}
      <div
        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-700 ease-out"
        style={{
          opacity: !isLightsOn && !isHovered ? 1 : 0,
          background: `radial-gradient(circle clamp(260px, 42vw, 420px) at var(--spot-x, 50%) var(--spot-y, 40%), rgba(226,238,90,0.08) 0%, rgba(17,17,17,0.52) 55%, rgba(17,17,17,0.90) 100%)`
        }}
        aria-hidden="true"
      />

      {/* Active interactive spotlight layer (smoothly fades in on touch / hover) */}
      <div
        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-400 ease-out"
        style={{
          opacity: !isLightsOn && isHovered ? 1 : 0,
          background: `radial-gradient(circle clamp(220px, 35vw, 320px) at var(--spot-x, 50%) var(--spot-y, 45%), rgba(255,255,255,0.02) 0%, rgba(226,238,90,0.12) 30%, rgba(17,17,17,0.68) 65%, rgba(17,17,17,0.94) 100%)`
        }}
        aria-hidden="true"
      />

      {/* Center Specular Glare directly beneath touch point / cursor */}
      <div
        className="absolute pointer-events-none z-35 rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-out"
        style={{
          opacity: !isLightsOn && isHovered ? 1 : 0,
          left: "var(--spot-x, 50%)",
          top: "var(--spot-y, 45%)",
          width: "140px",
          height: "140px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.36) 0%, rgba(226,238,90,0.16) 45%, transparent 70%)",
          filter: "blur(12px)"
        }}
        aria-hidden="true"
      />



      {/* Bottom Chapter Marker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full pt-4 flex items-center justify-between text-[10px] font-mono text-ivory-400/60 z-32">
        <span>01 // SUBJECT IDENTIFICATION</span>
        <a
          href="#about-subject"
          className="hover:text-[#e2ee5a] transition-colors flex items-center gap-1 py-1"
        >
          <span>PROCEED TO CH. 01</span>
          <ArrowDown size={11} />
        </a>
      </div>
    </section>
  );
}
