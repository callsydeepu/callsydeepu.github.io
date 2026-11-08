import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, ShieldCheck, Terminal, Cpu, Sparkles, FileText } from "lucide-react";
import { profile, editorialStats } from "../data";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const portraitFrameRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Opening cinematic reveal sequence
      tl.fromTo(
        kickerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
      )
        .fromTo(
          headlineRef.current?.querySelectorAll(".reveal-line") || [],
          { y: 80, opacity: 0, rotateX: -20 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.1, stagger: 0.15 },
          "-=0.5"
        )
        .fromTo(
          portraitFrameRef.current,
          { opacity: 0, scale: 0.94, filter: "blur(8px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power2.out" },
          "-=0.9"
        )
        .fromTo(
          summaryRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.7"
        )
        .fromTo(
          statsRef.current?.children || [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
          "-=0.5"
        )
        .fromTo(
          scrollCueRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.3"
        );

      // Subtle scroll parallax on the portrait frame
      if (portraitFrameRef.current) {
        gsap.to(portraitFrameRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-[95vh] w-full pt-32 pb-20 flex flex-col justify-between overflow-hidden border-b border-white/10"
      style={{
        backgroundImage: `radial-gradient(ellipse at 80% 20%, rgba(229,193,88,0.06), transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(75,146,219,0.04), transparent 50%)`
      }}
    >
      {/* Editorial Watermark & Grid Rules */}
      <div className="absolute top-28 left-6 sm:left-12 text-[10px] font-mono tracking-widest text-ivory-400/40 pointer-events-none select-none">
        DOSSIER // APPLIED AI & DISTRIBUTED SYSTEMS
      </div>
      <div className="absolute top-28 right-6 sm:right-12 text-[10px] font-mono tracking-widest text-ivory-400/40 pointer-events-none select-none hidden md:block">
        REF: AMBATI-SD-026 // PARUL UNIVERSITY
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Main Typographic Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Editorial Kicker */}
            <div ref={kickerRef} className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-yellow/10 border border-accent-yellow/30 text-accent-yellow font-mono text-[10px] tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow animate-ping" />
                {profile.status}
              </span>
              <span className="text-ivory-400 text-xs font-mono tracking-wider hidden sm:inline">
                • {profile.location}
              </span>
            </div>

            {/* Outsized Expressive Typography */}
            <div ref={headlineRef} className="perspective-1000 mb-6">
              <div className="overflow-hidden">
                <h1 className="reveal-line text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-ivory-300/70 mb-2">
                  INVESTIGATIVE DOSSIER // {profile.name.toUpperCase()}
                </h1>
              </div>

              <div className="overflow-hidden">
                <div className="reveal-line text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.0]">
                  ENGINEERING
                </div>
              </div>

              <div className="overflow-hidden">
                <div className="reveal-line text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-transparent leading-[1.0] [WebkitTextStroke:1.5px_#f5f2eb]">
                  INTELLIGENCE
                  <span className="text-accent-yellow ml-2" style={{ WebkitTextStroke: "0px" }}>.</span>
                </div>
              </div>

              <div className="overflow-hidden mt-1">
                <div className="reveal-line text-2xl sm:text-4xl md:text-5xl font-serif italic font-normal text-ivory-200/90 leading-[1.1]">
                  From modular agents to production RAG.
                </div>
              </div>
            </div>

            {/* Accurate Professional Narrative */}
            <div ref={summaryRef} className="max-w-xl mb-8 space-y-4">
              <p className="text-sm sm:text-base text-ivory-300 leading-relaxed font-sans">
                {profile.summary}
              </p>
              <div className="p-3.5 rounded-lg bg-ink-850/80 border-l-2 border-accent-yellow text-xs font-mono text-ivory-300/90 flex items-start gap-2.5">
                <Terminal size={15} className="text-accent-yellow shrink-0 mt-0.5" />
                <span>
                  Focus: LangChain & LangGraph Orchestration • Qdrant & Redis Latency Optimization • Ollama Local Inference • FastAPI
                </span>
              </div>
            </div>

            {/* Actions & Links */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-accent-yellow text-ink-950 font-mono text-xs font-bold tracking-wider uppercase hover:bg-accent-yellowLight transition-all duration-200 shadow-glow"
              >
                <span>EXPLORE CASE STUDIES</span>
                <ArrowDown size={14} />
              </a>

              <a
                href="#collaborate"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-ink-850 text-ivory-100 border border-white/15 font-mono text-xs font-medium tracking-wider uppercase hover:border-accent-yellow hover:text-accent-yellow transition-all duration-200"
              >
                <span>LET’S COLLABORATE</span>
                <ArrowUpRight size={14} />
              </a>

              <a
                href={profile.resumePdf}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-lg text-ivory-400 hover:text-ivory-100 font-mono text-xs tracking-wider transition-colors"
              >
                <FileText size={15} />
                <span>RESUME (PDF)</span>
              </a>
            </div>
          </div>

          {/* Editorial Portrait Column (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              ref={portraitFrameRef}
              className="relative w-full max-w-sm sm:max-w-md aspect-[3/4] rounded-2xl p-3 bg-gradient-to-b from-white/15 via-white/5 to-white/10 border border-white/20 shadow-2xl backdrop-blur-md group"
            >
              {/* Technical Film Frame Edge Markers */}
              <div className="absolute top-2 left-3 text-[9px] font-mono tracking-widest text-ivory-400/80 z-20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
                <span>REC ● 00:14:28 // 35MM</span>
              </div>
              <div className="absolute top-2 right-3 text-[9px] font-mono tracking-widest text-ivory-400/80 z-20">
                <span>ISO 400 • F/1.8</span>
              </div>

              {/* Optical Corner Reticles */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-accent-yellow z-20 pointer-events-none" />
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-accent-yellow z-20 pointer-events-none" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-accent-yellow z-20 pointer-events-none" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-accent-yellow z-20 pointer-events-none" />

              {/* Portrait Image Container */}
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-ink-950">
                <picture>
                  <source srcSet={profile.portrait} type="image/webp" />
                  <img
                    src={profile.portraitJpg}
                    alt="Sai Deepak Ambati — AI Engineer"
                    className="w-full h-full object-cover object-center filter grayscale contrast-[1.08] brightness-[0.92] group-hover:filter-none group-hover:scale-105 transition-all duration-700 ease-out"
                    loading="eager"
                  />
                </picture>

                {/* Editorial Vignette & Warm Tint Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-black/30 pointer-events-none" />
                <div className="absolute inset-0 bg-accent-yellow/5 mix-blend-color pointer-events-none" />

                {/* Lower Dossier Badge */}
                <div className="absolute bottom-3 inset-x-3 p-3 rounded-lg bg-ink-900/90 border border-white/10 backdrop-blur-md z-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-accent-yellow" />
                      <div>
                        <div className="text-[11px] font-mono font-bold text-white tracking-wide">
                          {profile.name}
                        </div>
                        <div className="text-[9px] font-mono text-ivory-400">
                          {profile.education.institution} • CGPA {profile.education.cgpa}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30">
                      AI SPEC.
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative Film Sprocket Holes (Editorial VOX Style) */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1.5 h-3 rounded-sm bg-white/20" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Stats Ribbon */}
        <div
          ref={statsRef}
          className="mt-16 sm:mt-20 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
        >
          {editorialStats.map((stat, i) => (
            <div key={i} className="flex flex-col border-l border-white/10 pl-4 sm:pl-6">
              <div className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight flex items-baseline gap-1">
                <span>{stat.value}</span>
                {i === 0 && <span className="text-xs font-mono text-accent-yellow">/ 10</span>}
              </div>
              <div className="text-xs font-mono text-ivory-200 mt-1 uppercase tracking-wider font-semibold">
                {stat.label}
              </div>
              <div className="text-[11px] text-ivory-400/80 font-sans mt-0.5">
                {stat.note}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Cue Indicator */}
      <div className="w-full flex justify-center pt-8">
        <a
          ref={scrollCueRef}
          href="#about"
          className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-ivory-400 hover:text-accent-yellow transition-colors"
        >
          <span>SCROLL TO ENTER INVESTIGATION</span>
          <ArrowDown size={12} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
}

