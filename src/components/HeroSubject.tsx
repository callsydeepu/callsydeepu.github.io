import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Sun, Moon, ArrowUpRight, Sparkles } from "lucide-react";
import { profile as defaultProfile } from "../data";
import { usePortfolioData } from "../context/PortfolioContext";

gsap.registerPlugin(ScrollTrigger);

export function HeroSubject() {
  const { bio } = usePortfolioData();
  const profile = { ...defaultProfile, ...bio };

  const heroRef = useRef<HTMLElement>(null);
  const initialsRef = useRef<HTMLDivElement>(null);
  const yellowPanelRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  // LIGHTS OFF mode on initial load by default
  const [isLightsOn, setIsLightsOn] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Coordinates for smooth cursor-following spotlight
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  // Sync with Navbar lights toggle via custom window event
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

  // Smooth spotlight movement interpolation with natural glide
  const updateSpotlight = useCallback(() => {
    if (!heroRef.current) return;

    // Smooth lerp (0.14) creates natural delayed motion following cursor
    currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.14;
    currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.14;

    heroRef.current.style.setProperty("--spot-x", `${currentPos.current.x}px`);
    heroRef.current.style.setProperty("--spot-y", `${currentPos.current.y}px`);

    rafId.current = requestAnimationFrame(updateSpotlight);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(updateSpotlight);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateSpotlight]);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLElement>) => {
    setIsHovered(true);
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    currentPos.current = { ...mousePos.current };
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  // GSAP Cinematic Entrance Sequence
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Initials entrance (opacity + scale)
      if (initialsRef.current) {
        tl.fromTo(
          initialsRef.current,
          { opacity: 0, scale: 0.92 },
          { opacity: 0.45, scale: 1, duration: 1.3, ease: "power2.out" }
        );
      }

      // 2. Yellow Panel reveal
      if (yellowPanelRef.current) {
        tl.fromTo(
          yellowPanelRef.current,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 1.1, ease: "power2.out" },
          "-=1.0"
        );
      }

      // 3. Portrait smooth upward reveal
      if (portraitRef.current) {
        tl.fromTo(
          portraitRef.current,
          { opacity: 0, y: 55, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" },
          "-=0.9"
        );
      }

      // 4. Staggered text & metadata entrance
      tl.fromTo(
        ".hero-stagger",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.08, ease: "power2.out" },
        "-=0.9"
      );

      // 5. Scroll-driven cinematic parallax exit towards Chapter 01
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!prefersReducedMotion && heroRef.current) {
        // Initials glide upward with deep background parallax
        if (initialsRef.current) {
          gsap.to(initialsRef.current, {
            yPercent: -22,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1
            }
          });
        }

        // Yellow panel glides at mid-depth speed
        if (yellowPanelRef.current) {
          gsap.to(yellowPanelRef.current, {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1
            }
          });
        }

        // Foreground portrait glides smoothly with subtle depth
        if (portraitRef.current) {
          gsap.to(portraitRef.current, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1
            }
          });
        }

        // Text content fades gently as user scrolls toward the next chapter
        gsap.to(".hero-stagger", {
          opacity: 0.25,
          y: -20,
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "25% top",
            end: "bottom 15%",
            scrub: 1
          }
        });
      }
    }, heroRef);

    // Initial spotlight centered on the portrait / hero right side
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      const initialX = rect.width * 0.72;
      const initialY = rect.height * 0.48;
      currentPos.current = { x: initialX, y: initialY };
      mousePos.current = { x: initialX, y: initialY };
      heroRef.current.style.setProperty("--spot-x", `${initialX}px`);
      heroRef.current.style.setProperty("--spot-y", `${initialY}px`);
    }

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="subject"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="relative min-h-screen min-h-[100vh] min-h-[100svh] hero-viewport-height w-full pt-24 sm:pt-28 lg:pt-32 pb-6 sm:pb-8 lg:pb-10 flex flex-col justify-between overflow-hidden bg-[#111111] select-none"
      style={{ touchAction: "pan-y" }}
    >
      {/* 1. LAYER 1: ENORMOUS OUTLINED INITIALS (BEHIND PORTRAIT & YELLOW PANEL) */}
      <div
        ref={initialsRef}
        className="absolute right-[-2%] sm:right-[1%] md:right-[3%] lg:right-[4%] top-[8%] bottom-[2%] flex items-center justify-end pointer-events-none select-none z-10 overflow-visible opacity-35"
      >
        <span
          className="font-condensed font-extrabold text-[54vw] sm:text-[42vw] md:text-[34vw] lg:text-[29vw] xl:text-[27vw] leading-none text-transparent tracking-tighter select-none drop-shadow-[0_0_50px_rgba(255,255,255,0.04)]"
          style={{
            WebkitTextStroke: "2px rgba(255, 255, 255, 0.20)"
          }}
        >
          {profile.heroInitials}
        </span>
      </div>

      {/* 2. LAYER 2: BRIGHT YELLOW BACKGROUND RECTANGULAR PANEL (DESKTOP ABSOLUTE BEHIND PORTRAIT) */}
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

      {/* 3. LAYER 3: LARGE NATURALLY ISOLATED CUTOUT PORTRAIT (DESKTOP ABSOLUTE EXTENDING BEYOND BOTTOM) */}
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
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full relative z-25 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* LEFT COLUMN: Editorial Subject Details (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* FIG. 01 — THE SUBJECT badge */}
            <div className="hero-stagger flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-ivory-300">
                <span className="w-2.5 h-2.5 bg-[#e24a4a] inline-block" />
                <span>FIG. 01 — THE SUBJECT</span>
              </div>
              <span className="text-white/20 font-mono text-xs">//</span>
              <div className="px-2 py-0.5 bg-[#e2ee5a] text-[#0a0a0c] font-mono text-[10px] font-bold uppercase tracking-wider">
                {profile.primaryLanguage}
              </div>
            </div>

            {/* Interactive Spotlight Prompt Indicator */}
            <div className="hero-stagger flex items-center gap-2.5 my-2 text-[11px] font-mono tracking-widest text-[#e2ee5a] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#e2ee5a] shadow-[0_0_8px_#e2ee5a] animate-ping" />
              <span>
                {isLightsOn
                  ? "● LIGHTS ACTIVE // FULL SYSTEM ILLUMINATED"
                  : isHovered
                  ? "● SPOTLIGHT ACTIVE // MOVE CURSOR TO INSPECT"
                  : "● LIGHTS OFF // MOVE CURSOR OR TOGGLE LIGHTS"}
              </span>
            </div>

            {/* Name Heading in Oversized Bold Condensed Typography */}
            <div className="hero-stagger mt-2 mb-3">
              <div className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-ivory-400 mb-1">
                {profile.kicker}
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] xl:text-[108px] font-condensed font-extrabold tracking-tight text-white leading-[0.88] uppercase">
                {profile.displayName}
              </h1>
            </div>

            {/* Professional Positioning */}
            <div className="hero-stagger">
              <div className="text-lg sm:text-2xl md:text-3xl font-serif italic text-[#e2ee5a] leading-tight mb-4">
                {profile.positioning}
              </div>
            </div>

            {/* Thin Horizontal Divider Line */}
            <div className="hero-stagger w-full max-w-xl h-[1px] bg-white/15 my-3" />

            {/* Short Professional Introduction */}
            <div className="hero-stagger max-w-xl">
              <p className="text-xs sm:text-sm md:text-base font-sans text-ivory-300 leading-relaxed">
                {profile.summary}
              </p>
            </div>

            {/* Subtle Editorial Metadata Row */}
            <div className="hero-stagger flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-[10px] sm:text-[11px] font-mono text-ivory-400 uppercase tracking-wider">
              <span>LOC: {profile.location.split(",")[0]}</span>
              <span className="text-white/20">•</span>
              <span>ROLE: AI & SYSTEMS UNDERGRADUATE</span>
              <span className="text-white/20">•</span>
              <span className="text-[#e2ee5a] font-bold">PORTFOLIO</span>
            </div>

            {/* CTA Buttons */}
            <div className="hero-stagger flex flex-wrap items-center gap-4 mt-8">
              <a
                href="#case-files"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-[#e2ee5a] text-[#0a0a0c] font-mono text-xs font-bold tracking-wider uppercase hover:bg-white hover:text-black transition-all shadow-[0_0_25px_rgba(226,238,90,0.3)] active:scale-95"
              >
                <span>EXPLORE CASE FILES</span>
                <ArrowDown size={14} />
              </a>

              <a
                href="#hire-me"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-black/80 text-white border border-white/20 font-mono text-xs font-bold tracking-wider uppercase hover:border-[#e2ee5a] hover:text-[#e2ee5a] transition-all active:scale-95"
              >
                <span>PULL ME INTO YOUR TEAM</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN (MOBILE / TABLET ONLY): Stacks naturally below text on small screens */}
          <div className="block lg:hidden relative w-full max-w-[340px] sm:max-w-[420px] mx-auto mt-8 flex justify-center items-end">
            {/* Mobile Yellow Panel */}
            <div
              className="absolute inset-x-4 top-8 bottom-0 bg-[#e2ee5a] z-15 pointer-events-none"
              style={{
                boxShadow: "0 0 45px rgba(226, 238, 90, 0.25)"
              }}
            />
            {/* Mobile Portrait Cutout */}
            <picture className="relative z-20">
              <source srcSet={profile.portraitCutout} type="image/webp" />
              <img
                src={profile.portraitCutoutPng || profile.portraitJpg}
                alt="Sai Deepak Ambati"
                className="w-full h-auto max-h-[460px] sm:max-h-[520px] aspect-[1696/1580] object-contain object-bottom select-none pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                loading="eager"
              />
            </picture>
          </div>

          {/* Desktop Right Spacer to preserve 7/5 grid rhythm */}
          <div className="hidden lg:block lg:col-span-5 pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      {/* 3. LIGHTS OFF / ON INTERACTIVE SPOTLIGHT MASK */}
      <div
        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-700"
        style={{
          opacity: isLightsOn ? 0 : 1,
          background: isHovered
            ? `radial-gradient(circle 280px at var(--spot-x, 70%) var(--spot-y, 45%), rgba(255,255,255,0.01) 0%, rgba(226,238,90,0.08) 35%, rgba(17,17,17,0.72) 65%, rgba(17,17,17,0.92) 100%)`
            : `radial-gradient(circle 220px at var(--spot-x, 70%) var(--spot-y, 45%), rgba(226,238,90,0.08) 0%, rgba(17,17,17,0.78) 50%, rgba(17,17,17,0.94) 100%)`
        }}
      />

      {/* Center Specular Glare beneath cursor during hover */}
      {!isLightsOn && isHovered && (
        <div
          className="absolute pointer-events-none z-35 rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150"
          style={{
            left: "var(--spot-x, 70%)",
            top: "var(--spot-y, 45%)",
            width: "140px",
            height: "140px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(226,238,90,0.15) 45%, transparent 70%)",
            filter: "blur(10px)"
          }}
        />
      )}

      {/* TOP-RIGHT LIGHTS ON / OFF TOGGLE PILL */}
      <div className="absolute top-20 sm:top-24 right-5 sm:right-8 lg:right-12 z-40">
        <button
          type="button"
          onClick={toggleLights}
          aria-label={isLightsOn ? "Switch to Lights Off" : "Switch to Lights On"}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-xl ${
            isLightsOn
              ? "bg-[#e2ee5a] text-[#0a0a0c] shadow-[0_0_25px_rgba(226,238,90,0.5)]"
              : "bg-black/80 text-[#e2ee5a] border border-[#e2ee5a]/50 hover:bg-[#e2ee5a]/10"
          }`}
        >
          {isLightsOn ? <Sun size={13} /> : <Moon size={13} />}
          <span>{isLightsOn ? "LIGHTS OFF" : "LIGHTS ON"}</span>
        </button>
      </div>

      {/* Bottom Chapter Marker */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full pt-4 flex items-center justify-between text-[10px] font-mono text-ivory-400/60 z-25">
        <span>01 // SUBJECT IDENTIFICATION</span>
        <a
          href="#about-subject"
          className="hover:text-[#e2ee5a] transition-colors flex items-center gap-1"
        >
          <span>PROCEED TO CHAPTER 01</span>
          <ArrowDown size={11} />
        </a>
      </div>
    </section>
  );
}
