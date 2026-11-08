import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Github,
  ArrowUpRight,
  BrainCircuit,
  BarChart3,
  Video,
  FileSearch,
  Mail,
  ChevronLeft,
  ChevronRight,
  Check,
  Cpu,
  Layers
} from "lucide-react";
import { featuredProjects as defaultFeaturedProjects, FeaturedProject } from "../data";
import { usePortfolioData } from "../context/PortfolioContext";

gsap.registerPlugin(ScrollTrigger);

// Interactive Flashlight / Torchlight Preview Card with Layered Document Stack (Screenshots 1 & 2)
function TorchlightPreview({ project }: { project: FeaturedProject }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [torchPos, setTorchPos] = useState({ x: 190, y: 130 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth mouse move tracking inside the preview
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTorchPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Subtle natural floating oscillation when not hovered
  useEffect(() => {
    if (isHovered) return;
    let frameId: number;
    let t = 0;
    const animate = () => {
      t += 0.02;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        setTorchPos({
          x: centerX + Math.sin(t) * (rect.width * 0.2),
          y: centerY + Math.cos(t * 1.2) * (rect.height * 0.16)
        });
      }
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isHovered]);

  return (
    <div className="w-full select-none">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full h-[270px] sm:h-[310px] md:h-[330px] rounded-2xl bg-gradient-to-b from-[#131318] via-[#0c0c10] to-[#070709] border border-white/15 p-4 sm:p-5 overflow-hidden shadow-2xl flex flex-col justify-between group cursor-crosshair"
      >
        {/* Top Window Bar */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-[10px] font-mono text-ivory-400 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e24a4a]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#e2ee5a]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
            <span className="ml-2 font-bold text-white uppercase tracking-widest">
              DOSSIER // {project.number} — {project.category}
            </span>
          </div>
          <span className="text-[#e2ee5a] font-bold tracking-wider">DRAG TORCH TO INSPECT</span>
        </div>

        {/* 3D Stacked Translucent Document Dossier (Screenshot 2 Exact Visual!) */}
        <div className="relative my-auto w-full h-[180px] sm:h-[200px] flex items-center justify-center z-10">
          <div className="relative w-full max-w-[420px] h-full flex items-center justify-center">
            {/* Sheet 3: Deepest Background Layer */}
            <div className="absolute inset-x-6 top-3 bottom-1 rounded-xl bg-white/[0.02] border border-white/5 transform -rotate-6 scale-90 translate-x-4 -translate-y-2 pointer-events-none opacity-40">
              <div className="p-3 space-y-2">
                <div className="h-1.5 w-20 bg-white/20 rounded-full" />
                <div className="h-1.5 w-44 bg-white/10 rounded-full" />
                <div className="h-1.5 w-32 bg-white/10 rounded-full" />
              </div>
            </div>

            {/* Sheet 2: Middle Translucent Layer with Red Alert Stroke */}
            <div className="absolute inset-x-3 top-2 bottom-1.5 rounded-xl bg-white/[0.04] border border-white/10 shadow-lg transform -rotate-3 scale-95 translate-x-2 -translate-y-1 pointer-events-none opacity-70">
              <div className="p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-1.5 w-24 bg-white/30 rounded-full" />
                  <div className="h-1.5 w-10 bg-white/20 rounded-full" />
                </div>
                <div className="h-1.5 w-full bg-white/15 rounded-full" />
                {/* Secondary highlight line */}
                <div className="h-2.5 w-36 bg-[#e24a4a]/30 rounded px-1 flex items-center">
                  <div className="h-1 w-full bg-[#ff6b6b] rounded-sm" />
                </div>
                <div className="h-1.5 w-4/5 bg-white/15 rounded-full" />
              </div>
            </div>

            {/* Sheet 1: Primary Document with Yellow & Red Highlights (Exact Match to Screenshot 2!) */}
            <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-[#16161f]/95 via-[#0e0e14]/98 to-[#09090c] border border-white/20 p-4 shadow-2xl flex flex-col justify-between backdrop-blur-md">
              {/* Document Header */}
              <div className="flex items-center justify-between pb-1.5 border-b border-white/15 text-[10px] font-mono">
                <span className="text-[#e2ee5a] font-bold tracking-wider">
                  SYSTEM RECORD // {project.category}
                </span>
                <span className="text-white/40 text-[9px]">AUDIT: VERIFIED</span>
              </div>

              {/* Text Lines with Yellow & Red Highlights */}
              <div className="space-y-2 my-auto">
                {/* Prominent Bright Yellow Highlight Bar (Matches Screenshot 2) */}
                <div className="relative inline-block px-2.5 py-0.5 bg-[#e2ee5a] text-[#0a0a0c] font-mono text-[10px] sm:text-[11px] font-extrabold uppercase rounded-none tracking-wider">
                  {project.id === "agentspace"
                    ? "AUTONOMOUS MULTI-AGENT PLATFORM // ACTIVE"
                    : project.id === "researchmind"
                    ? "4-AGENT RESEARCH PIPELINE // TAVILY + LCEL"
                    : project.id === "system-anomaly"
                    ? "ISOLATION FOREST SOC // 8 STATISTICAL FEATURES"
                    : project.id === "mockmate"
                    ? "WHISPER + MEDIAPIPE AUDIO-VISUAL // 60 FPS"
                    : `CRITICAL TELEMETRY // ${project.title}`}
                </div>

                {/* Monospace Code / Audit Metadata Lines */}
                <div className="space-y-1.5 font-mono text-[9px] sm:text-[10px]">
                  <div className="flex items-center gap-2 text-ivory-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e2ee5a]" />
                    <span className="text-white/50">0x7F2A:</span>
                    <span className="text-white font-medium truncate">
                      {project.stack.slice(0, 4).join(" • ")}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/20 rounded-full" />
                  <div className="h-1.5 w-5/6 bg-white/15 rounded-full" />
                </div>

                {/* Coral Red Highlight Line (Matches Screenshot 2) */}
                <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-[#e24a4a]/25 border border-[#e24a4a]/50 text-[#ff7070] font-mono text-[9px] sm:text-[10px] font-bold rounded-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e24a4a]" />
                  <span>
                    {project.id === "system-anomaly"
                      ? "ZERO ANOMALY // ISOLATION FOREST CONVERGED"
                      : project.id === "researchmind"
                      ? "CRITIC AGENT // AUTOMATED QUALITY SCORING"
                      : "ZERO LEAKAGE // SECURE EXECUTION CONFIRMED"}
                  </span>
                </div>

                <div className="h-1.5 w-3/4 bg-white/15 rounded-full" />
              </div>

              {/* Document Footer */}
              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-ivory-400">
                <span>HASH: SHA256 // {project.year}</span>
                <span className="text-[#e2ee5a] font-bold">TORCH BEAM ON</span>
              </div>
            </div>

            {/* Lateral Floating UI Data Blocks on Right (Screenshot 2) */}
            <div className="hidden sm:flex flex-col gap-2 ml-3 shrink-0 w-24">
              <div className="p-2 rounded-lg bg-black/80 border border-white/15 text-[9px] font-mono">
                <div className="text-ivory-400">STATUS</div>
                <div className="text-[#e2ee5a] font-bold">OPTIMAL</div>
              </div>
              <div className="p-2 rounded-lg bg-black/80 border border-white/15 text-[9px] font-mono">
                <div className="text-ivory-400">INDEXED</div>
                <div className="text-white font-bold">100%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stacked Document Highlight Footer Tags */}
        <div className="relative z-10 pt-2 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded-none bg-[#e2ee5a] text-[#0a0a0c] font-mono text-[9px] font-bold uppercase">
            VERIFIED METRICS
          </span>
          <span className="px-2 py-0.5 rounded-none bg-white/10 text-white font-mono text-[9px] uppercase">
            PRODUCTION READY
          </span>
          <span className="px-2 py-0.5 rounded-none bg-white/10 text-ivory-300 font-mono text-[9px] uppercase">
            {project.year} ARCHITECTURE
          </span>
        </div>

        {/* THE INTERACTIVE TORCHLIGHT / FLASHLIGHT BEAM (Screenshots 1 & 2) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
          style={{
            background: `radial-gradient(circle 135px at ${torchPos.x}px ${torchPos.y}px, rgba(255,255,255,0.32) 0%, rgba(226,238,90,0.22) 35%, transparent 75%)`
          }}
        />
        <div
          className="absolute w-32 h-32 rounded-full border border-[#e2ee5a]/50 pointer-events-none transition-transform duration-75 z-20"
          style={{
            left: torchPos.x - 64,
            top: torchPos.y - 64,
            boxShadow: "0 0 35px rgba(226,238,90,0.3)"
          }}
        />
      </div>

      {/* COMPACT METRICS ROW (Exact styling from Screenshot 2!) */}
      {project.metrics && project.metrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-white/10 mt-3 px-1">
          {project.metrics.map((metric, mIdx) => (
            <div key={mIdx} className="space-y-0.5">
              <div
                className={`text-xl sm:text-2xl font-display font-extrabold ${
                  metric.highlight ? "text-[#e2ee5a]" : "text-white"
                }`}
              >
                {metric.value}
              </div>
              <div className="text-[9px] sm:text-[10px] font-mono text-ivory-400 uppercase tracking-wider leading-tight">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Project Details Component (Used in alternating layout)
function ProjectDetails({
  project,
  isFirstProject = false
}: {
  project: FeaturedProject;
  isFirstProject?: boolean;
}) {
  return (
    <div className="w-full flex flex-col justify-between space-y-4 sm:space-y-6">
      <div>
        {/* Oversized Outlined Yellow Project Number (Exact from Screenshots 1 & 2) */}
        <div className="relative inline-block select-none leading-none mb-2 sm:mb-3">
          {/* Subtle 3D Wireframe Offset Layer */}
          <span
            aria-hidden="true"
            className="absolute top-1 left-1 font-display font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-transparent [WebkitTextStroke:1.5px_rgba(226,238,90,0.3)] pointer-events-none"
          >
            {project.number}
          </span>
          {/* Main Glowing Yellow Outlined Typography */}
          <span className="relative font-display font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-transparent [WebkitTextStroke:2px_#e2ee5a] drop-shadow-[0_0_25px_rgba(226,238,90,0.3)]">
            {project.number}
          </span>
        </div>

        {/* Small Monospace Label above title (Exact from Screenshots 1 & 2) */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#e2ee5a] uppercase tracking-wider mb-2">
          <span>02 // {project.category} // {project.year}</span>
        </div>

        {/* Bold Project Title */}
        <h3 className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight uppercase leading-[0.96] mb-3">
          {project.title}
        </h3>

        {/* Short Editorial Description */}
        <p className="text-xs sm:text-sm md:text-base text-ivory-300 font-sans leading-relaxed mb-4 max-w-xl">
          {project.description}
        </p>

        {/* Tech Stack Pills (Black Rectangular Tags with White/Grey Border) */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
          {project.stack.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-none bg-black/60 border border-white/20 text-[10px] sm:text-xs font-mono font-bold text-white tracking-wider uppercase hover:border-[#e2ee5a] transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Buttons: CASE FILES button opens project GitHub in new tab */}
      <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-white/10">
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#e2ee5a] text-[#0a0a0c] font-mono text-xs sm:text-sm font-extrabold uppercase tracking-wider hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(226,238,90,0.3)] active:scale-95"
        >
          <span>CASE FILES</span>
          <ArrowUpRight size={14} />
        </a>

        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-ivory-300 hover:text-[#e2ee5a] transition-colors uppercase tracking-wider ml-1 group"
        >
          <Github size={14} />
          <span>VIEW REPOSITORY</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </div>
    </div>
  );
}

export function ChapterCaseFiles() {
  const { projects: dynamicProjects } = usePortfolioData();
  const featuredProjects = dynamicProjects && dynamicProjects.length > 0 ? dynamicProjects : defaultFeaturedProjects;

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Mouse drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // GSAP Progressive Scroll Entrance & Parallax
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // 1. Top Section Header Entrance
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 2. Project Track Content Progressive Reveal
      if (trackRef.current) {
        gsap.fromTo(
          trackRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: trackRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // 3. Subtle Parallax on the Large Project Numbers
      if (!prefersReducedMotion && sectionRef.current) {
        gsap.utils.toArray<HTMLElement>(".project-number-layer").forEach((numEl) => {
          gsap.to(numEl, {
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
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Update scroll status and active index
  const updateScrollStatus = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 20);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);

    const maxScroll = el.scrollWidth - el.clientWidth;
    const progress = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;
    setScrollProgress(progress);

    // Compute which slide is most visible
    const slideWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 32
      : 800;
    const idx = Math.min(
      featuredProjects.length - 1,
      Math.max(0, Math.round(el.scrollLeft / slideWidth))
    );
    setActiveIdx(idx);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    updateScrollStatus();
    el.addEventListener("scroll", updateScrollStatus, { passive: true });
    window.addEventListener("resize", updateScrollStatus);

    return () => {
      el.removeEventListener("scroll", updateScrollStatus);
      window.removeEventListener("resize", updateScrollStatus);
    };
  }, [updateScrollStatus]);

  // Navigate to slide index
  const scrollToSlide = (idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const slides = el.children;
    if (slides[idx]) {
      (slides[idx] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  };

  const scrollDirection = (dir: "left" | "right") => {
    const target = dir === "left" ? Math.max(0, activeIdx - 1) : Math.min(featuredProjects.length - 1, activeIdx + 1);
    scrollToSlide(target);
  };

  // Mouse Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const el = trackRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    el.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <section
      ref={sectionRef}
      id="case-files"
      className="py-16 sm:py-24 md:py-28 bg-[#0a0a0c] text-ivory-100 border-b border-white/10 select-none overflow-hidden relative"
    >
      {/* Top Section Header Controls */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full mb-8 sm:mb-12">
        <div ref={headingRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#e2ee5a] inline-block" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#e2ee5a] font-bold">
              CH. 02 — CASE FILES
            </span>
            <span className="text-white/30 font-mono text-xs">//</span>
            <span className="text-xs font-mono uppercase tracking-widest text-ivory-400">
              ACTIVE CASE: 0{activeIdx + 1} OF 0{featuredProjects.length}
            </span>
          </div>

          {/* Slide Navigation Buttons & Quick Jump Tabs */}
          <div className="flex items-center gap-3">
            {/* Direct Project Jump Pills */}
            <div className="hidden lg:flex items-center gap-1.5 font-mono text-xs">
              {featuredProjects.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => scrollToSlide(idx)}
                  className={`px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer ${
                    activeIdx === idx
                      ? "bg-[#e2ee5a] text-[#0a0a0c] font-bold shadow-[0_0_15px_rgba(226,238,90,0.3)]"
                      : "bg-white/5 text-ivory-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {p.number} {p.title.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Prev / Next Chevrons */}
            <div className="flex items-center gap-1.5 ml-2">
              <button
                type="button"
                onClick={() => scrollDirection("left")}
                disabled={!canScrollLeft}
                aria-label="Previous Project"
                className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? "bg-white/5 border-white/20 text-white hover:bg-[#e2ee5a] hover:text-[#0a0a0c] hover:border-[#e2ee5a] cursor-pointer"
                    : "bg-white/[0.02] border-white/5 text-ivory-400/30 cursor-not-allowed"
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={() => scrollDirection("right")}
                disabled={!canScrollRight}
                aria-label="Next Project"
                className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${
                  canScrollRight
                    ? "bg-white/5 border-white/20 text-white hover:bg-[#e2ee5a] hover:text-[#0a0a0c] hover:border-[#e2ee5a] cursor-pointer"
                    : "bg-white/[0.02] border-white/5 text-ivory-400/30 cursor-not-allowed"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FULLY DYNAMIC HORIZONTAL PROJECT SHOWCASE TRACK (ALTERNATING LAYOUT) */}
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex gap-6 sm:gap-10 md:gap-14 overflow-x-auto scroll-smooth snap-x snap-mandatory px-5 sm:px-8 lg:px-12 hide-scrollbar cursor-grab active:cursor-grabbing will-change-scroll py-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {featuredProjects.map((project, idx) => {
          // Slide 0: Project 01 (Includes the editorial intro "THREE SYSTEMS. Built in 2026." on the left)
          if (idx === 0) {
            return (
              <article
                key={project.id}
                className="w-[92vw] max-w-[1280px] shrink-0 snap-center rounded-2xl bg-gradient-to-b from-[#101015] to-[#08080b] border border-white/15 p-6 sm:p-8 md:p-10 shadow-2xl transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Left Side: Large Editorial Heading "THREE SYSTEMS. Built in 2026." (Exact from Screenshot 1) */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-6 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0">
                    <div>
                      {/* Section Tag with line (Screenshot 1) */}
                      <div className="flex items-center gap-3 mb-6">
                        <span className="px-2.5 py-0.5 bg-[#e2ee5a] text-[#0a0a0c] font-mono text-xs font-bold uppercase rounded-none">
                          02 // CASE FILES
                        </span>
                        <div className="flex-1 h-[1px] bg-white/15" />
                      </div>

                      <h2 className="text-4xl sm:text-6xl md:text-7xl font-condensed font-extrabold text-white tracking-tight uppercase leading-[0.9]">
                        SELECTED<br />WORKS
                      </h2>
                      <div className="text-3xl sm:text-5xl md:text-4xl font-serif italic font-normal text-[#e2ee5a] mt-2 mb-6 leading-none">
                        Built to make an impact
                      </div>

                      <p className="text-xs sm:text-sm text-ivory-300 font-sans leading-relaxed max-w-md">
                        Autonomous multi-agent workspaces, intelligent research pipelines, and real-time machine-learning OS anomaly detection engines built for production scale. → drag the torch to inspect.
                      </p>
                    </div>

                    <div className="pt-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e2ee5a] tracking-widest uppercase">
                        <span>KEEP SCROLLING</span>
                        <span>→</span>
                      </div>
                      {/* Yellow Progress Indicator Bar (Screenshot 1) */}
                      <div className="w-40 h-[2px] bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#e2ee5a] transition-all duration-150"
                          style={{ width: `${Math.max(15, scrollProgress * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Project 01 Information + Visual Preview (Screenshot 1) */}
                  <div className="lg:col-span-7 space-y-6">
                    <ProjectDetails project={project} isFirstProject={true} />
                    <div className="pt-2">
                      <TorchlightPreview project={project} />
                    </div>
                  </div>
                </div>
              </article>
            );
          }

          // Alternating Pattern for Projects 2, 3, 4, 5:
          // Even indexes (Project 02, 04): VISUAL ON LEFT, INFO ON RIGHT (Exact match of Screenshot 2!)
          // Odd indexes (Project 03, 05): INFO ON LEFT, VISUAL ON RIGHT
          const isVisualOnLeft = idx % 2 === 1; // Project 02 has idx=1 (odd 0-based), so visual is on the left!

          return (
            <article
              key={project.id}
              className="w-[92vw] max-w-[1280px] shrink-0 snap-center rounded-2xl bg-gradient-to-b from-[#101015] to-[#08080b] border border-white/15 p-6 sm:p-8 md:p-10 shadow-2xl transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {isVisualOnLeft ? (
                  <>
                    {/* LEFT COLUMN: Large Visual Preview + Metrics Row (Exact Screenshot 2!) */}
                    <div className="lg:col-span-6 order-2 lg:order-1">
                      <TorchlightPreview project={project} />
                    </div>

                    {/* RIGHT COLUMN: Project Number, Title, Description, Stack, CTA (Screenshot 2!) */}
                    <div className="lg:col-span-6 order-1 lg:order-2">
                      <ProjectDetails project={project} />
                    </div>
                  </>
                ) : (
                  <>
                    {/* LEFT COLUMN: Project Information */}
                    <div className="lg:col-span-6">
                      <ProjectDetails project={project} />
                    </div>

                    {/* RIGHT COLUMN: Large Visual Preview + Metrics Row */}
                    <div className="lg:col-span-6">
                      <TorchlightPreview project={project} />
                    </div>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* BOTTOM PROGRESS BAR & SCROLL CUE (Exact match of Screenshot 1 & 2) */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 mt-8 sm:mt-10">
        <div className="flex items-center justify-between text-xs font-mono text-ivory-400 mb-2">
          <div className="flex items-center gap-2 text-[#e2ee5a] font-bold tracking-widest uppercase">
            <span>KEEP SCROLLING</span>
            <span>→</span>
          </div>
          <span>
            0{activeIdx + 1} / 0{featuredProjects.length} CASE FILES
          </span>
        </div>

        {/* Thin Yellow Progress Line */}
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#e2ee5a] transition-all duration-200"
            style={{
              width: `${Math.max(20, ((activeIdx + 1) / featuredProjects.length) * 100)}%`
            }}
          />
        </div>
      </div>
    </section>
  );
}
