import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail,
  Copy,
  Check,
  X,
  ExternalLink,
  Github,
  Linkedin,
  FileText,
  Phone,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { HandIllustration } from "./HandDrawnIllustration";
import { profile } from "../data";

gsap.registerPlugin(ScrollTrigger);

export function HireMeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stringsGroupRef = useRef<SVGGElement>(null);
  const handWrapperRef = useRef<HTMLDivElement>(null);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Escape key listener for accessible dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // GSAP ScrollTrigger Entrance & String Drawing
  useEffect(() => {
    const ctx = gsap.context(() => {
      const strings = stringsGroupRef.current?.querySelectorAll("path");
      if (strings && strings.length > 0) {
        strings.forEach((str) => {
          const length = str.getTotalLength();
          gsap.set(str, {
            strokeDasharray: length,
            strokeDashoffset: length
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        });

        tl.to(strings, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power3.out",
          stagger: 0.1
        })
          .fromTo(
            handWrapperRef.current,
            { y: 60, opacity: 0, rotate: -6 },
            { y: 0, opacity: 1, rotate: 0, duration: 1.2, ease: "back.out(1.4)" },
            "-=1.1"
          )
          .fromTo(
            buttonWrapperRef.current,
            { scale: 0.88, opacity: 0, y: -20 },
            { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power2.out" },
            "-=1.0"
          );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Natural continuous harmonic tension sway & pointer-reactive physics
  useEffect(() => {
    let startTime = performance.now();
    let isRunning = true;

    const animateStrings = (now: number) => {
      if (!isRunning) return;
      const elapsed = (now - startTime) * 0.0018;

      if (stringsGroupRef.current) {
        const paths = stringsGroupRef.current.querySelectorAll("path");
        // Update subtle sag / sway on strings
        paths.forEach((p, idx) => {
          const sway = Math.sin(elapsed + idx * 0.7) * (3 + idx * 1.2);
          const pullX = mouseOffset.x * 0.08;
          const pullY = mouseOffset.y * 0.05;

          // Start coordinates near hand grip (relative to SVG 600x400)
          const startX = 175 + idx * 6;
          const startY = 275 - idx * 4;

          // End coordinates on button edge
          const targetX = 380 + idx * 28 + pullX;
          const targetY = 165 + idx * 6 + pullY;

          // Quadratic control point with dynamic physical tension & sway
          const cpX = (startX + targetX) * 0.48 + sway * 1.5;
          const cpY = (startY + targetY) * 0.52 + sway + (isHovered ? -12 : 8);

          p.setAttribute("d", `M ${startX} ${startY} Q ${cpX} ${cpY} ${targetX} ${targetY}`);
        });
      }

      // Small natural pulling tug on hand
      if (handWrapperRef.current) {
        const handTug = Math.sin(elapsed * 1.2) * 2;
        const handHoverTug = isHovered ? -4 : 0;
        handWrapperRef.current.style.transform = `translate3d(${mouseOffset.x * 0.03}px, ${
          handTug + handHoverTug + mouseOffset.y * 0.02
        }px, 0px) rotate(${-handTug * 0.3}deg)`;
      }

      rafId.current = requestAnimationFrame(animateStrings);
    };

    rafId.current = requestAnimationFrame(animateStrings);

    return () => {
      isRunning = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [mouseOffset, isHovered]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width * 0.5);
    const y = e.clientY - (rect.top + rect.height * 0.5);
    setMouseOffset({ x, y });
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(profile.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section
      id="collaborate"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setMouseOffset({ x: 0, y: 0 })}
      className="relative w-full py-28 md:py-36 bg-[#EAE8E2] text-[#141414] overflow-hidden select-none border-y border-[#d6d3c8]"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.7) 0%, rgba(234,232,226,0.3) 60%), radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)`,
        backgroundSize: "100% 100%, 24px 24px"
      }}
    >
      {/* Editorial registration marks & subtle grid */}
      <div className="absolute top-8 left-8 text-[11px] font-mono tracking-widest text-[#7a7872] flex items-center gap-3">
        <span>[SEC. 05 // COLLABORATION PROTOCOL]</span>
        <span className="hidden sm:inline">COORD: 22.3072° N, 73.1812° E</span>
      </div>
      <div className="absolute top-8 right-8 text-[11px] font-mono tracking-widest text-[#7a7872]">
        <span>STATUS: READY FOR DISPATCH</span>
      </div>
      <div className="absolute bottom-8 left-8 text-[10px] font-mono tracking-widest text-[#9c9990]">
        <span>+ CROSSHAIR ALIGNMENT VERIFIED</span>
      </div>
      <div className="absolute bottom-8 right-8 text-[10px] font-mono tracking-widest text-[#9c9990]">
        <span>DIRECT COMMUNIQUE INTERFACE</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-black/5 border border-black/10 text-[10px] font-mono tracking-wider uppercase text-[#54524c]">
            <Sparkles size={11} className="text-[#a8821a]" />
            <span>DIRECT INVITATION</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-[#111113] leading-[1.05]">
            Let’s engineer something <span className="underline decoration-[#e5c158] decoration-4 underline-offset-4">extraordinary</span>.
          </h2>
          <p className="mt-5 text-sm sm:text-base text-[#5c5a53] leading-relaxed font-sans max-w-xl mx-auto">
            Whether you are looking to architect agentic workflows, deploy privacy-first RAG pipelines, or build high-throughput full-stack products, my inbox is open.
          </p>
        </div>

        {/* Interactive Kinetic Stage: Hand pulling the Glossy Pill Button */}
        <div className="relative w-full max-w-2xl h-[340px] sm:h-[380px] mx-auto flex items-center justify-center">
          {/* Tension Strings SVG Canvas */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox="0 0 600 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="string-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.15" />
              </filter>
            </defs>
            <g ref={stringsGroupRef} filter="url(#string-shadow)">
              {/* 5 irregular thin black cords connecting hand grip to button */}
              <path
                d="M 175 275 Q 260 215 390 170"
                stroke="#111114"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 181 271 Q 275 210 415 174"
                stroke="#111114"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 187 267 Q 290 205 440 180"
                stroke="#111114"
                strokeWidth="2.0"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 193 263 Q 305 200 465 186"
                stroke="#111114"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 199 259 Q 320 195 490 192"
                stroke="#111114"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          </svg>

          {/* Hand Illustration below and to the left */}
          <div
            ref={handWrapperRef}
            className="absolute left-[2%] sm:left-[8%] bottom-[4%] w-[180px] sm:w-[220px] md:w-[250px] pointer-events-none transition-transform duration-100 ease-out z-10"
          >
            <HandIllustration tension={isHovered ? 1 : 0.3} />
          </div>

          {/* Glossy Jet-Black Pill Button */}
          <div
            ref={buttonWrapperRef}
            className="relative z-20 translate-x-[40px] sm:translate-x-[60px] md:translate-x-[75px] -translate-y-[15px]"
          >
            <motion.button
              type="button"
              onClick={() => setIsOpen(true)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{
                scale: 1.05,
                y: -4,
                boxShadow: "0 24px 45px -8px rgba(0,0,0,0.5), 0 0 30px rgba(229,193,88,0.3)"
              }}
              whileTap={{ scale: 0.98, y: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              aria-label="Open contact dialogue to collaborate"
              className="group relative inline-flex items-center gap-4 px-8 sm:px-10 py-5 rounded-full bg-[#0c0d10] text-[#f7f5f0] font-display font-bold text-base sm:text-lg tracking-wider uppercase border border-white/20 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.45)] cursor-pointer overflow-hidden backdrop-blur-md"
            >
              {/* Glossy Top Specular Highlight */}
              <div className="absolute inset-x-0 top-0 h-[48%] rounded-t-full bg-gradient-to-b from-white/30 via-white/8 to-transparent pointer-events-none" />

              {/* Dynamic glossy light sweep */}
              <div
                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-25deg] pointer-events-none transition-transform duration-700 ease-in-out -translate-x-[200%] group-hover:translate-x-[350%]"
              />

              {/* Subtle gold accent perimeter on hover */}
              <div className="absolute inset-0 rounded-full border border-transparent group-hover:border-[#e5c158]/50 transition-colors duration-300 pointer-events-none" />

              <span className="relative z-10 flex items-center gap-3 text-ivory-100 group-hover:text-white transition-colors">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e5c158] shadow-[0_0_10px_#e5c158] animate-pulse" />
                <span>LET’S COLLABORATE</span>
              </span>

              <div className="relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-ivory-200 group-hover:bg-[#e5c158] group-hover:text-black transition-all duration-300">
                <ArrowUpRight size={16} />
              </div>
            </motion.button>

            {/* Dimensional drop shadow on paper */}
            <div className="w-48 h-5 mx-auto mt-2 rounded-full bg-black/15 blur-md transform scale-y-50 pointer-events-none" />
          </div>
        </div>

        {/* Editorial Footnote / Action cues */}
        <div className="text-center mt-6">
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#75726a]">
            CLICK PILL TO OPEN DIRECT DOSSIER & VERIFIED CHANNELS
          </p>
        </div>
      </div>

      {/* Accessible Contact Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            {/* Darkened backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full max-w-xl rounded-2xl bg-ink-900 border border-white/15 p-6 sm:p-8 shadow-2xl text-ivory-100 z-10 overflow-hidden"
            >
              {/* Editorial Header bar */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-accent-yellow">
                    <span className="w-2 h-2 rounded-full bg-accent-yellow animate-ping" />
                    <span>DIRECT CONTACT DOSSIER</span>
                  </div>
                  <h3 id="modal-headline" className="text-2xl font-display font-bold text-white mt-1">
                    Start a Project with Sai Deepak
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close modal dialog"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-ivory-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body Content */}
              <div className="py-6 space-y-4">
                <p className="text-xs sm:text-sm text-ivory-300/80 leading-relaxed font-sans">
                  Available for full-time AI engineering roles, high-impact research projects, and contract collaborations in multi-agent orchestration and scalable LLM/RAG systems.
                </p>

                {/* Primary Contact: Email */}
                <div className="p-4 rounded-xl bg-ink-850 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-yellow/10 border border-accent-yellow/30 flex items-center justify-center text-accent-yellow">
                      <Mail size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono tracking-wider text-ivory-400 block">PRIMARY INBOX</span>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-sm font-mono font-medium text-ivory-100 hover:text-accent-yellow transition-colors underline decoration-white/20"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-white/5 border border-white/10 hover:border-accent-yellow hover:text-accent-yellow transition-colors text-ivory-200"
                  >
                    {copied ? <Check size={14} className="text-accent-yellow" /> : <Copy size={14} />}
                    <span>{copied ? "COPIED" : "COPY"}</span>
                  </button>
                </div>

                {/* Direct Phone / WhatsApp */}
                <div className="p-4 rounded-xl bg-ink-850 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center text-accent-blue">
                      <Phone size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono tracking-wider text-ivory-400 block">TELEPHONE / WHATSAPP</span>
                      <a
                        href={`tel:${profile.phone}`}
                        className="text-sm font-mono font-medium text-ivory-100 hover:text-accent-blue transition-colors"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyPhone}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-white/5 border border-white/10 hover:border-accent-blue hover:text-accent-blue transition-colors text-ivory-200"
                  >
                    {copiedPhone ? <Check size={14} className="text-accent-blue" /> : <Copy size={14} />}
                    <span>{copiedPhone ? "COPIED" : "COPY"}</span>
                  </button>
                </div>

                {/* Professional Links Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-ink-850 border border-white/10 hover:border-white/30 hover:bg-ink-800 transition-all text-xs font-mono text-ivory-200 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Linkedin size={16} className="text-accent-blue" />
                      <span>LinkedIn Profile</span>
                    </div>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-ink-850 border border-white/10 hover:border-white/30 hover:bg-ink-800 transition-all text-xs font-mono text-ivory-200 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Github size={16} className="text-white" />
                      <span>GitHub Repositories</span>
                    </div>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  <a
                    href={profile.resumePdf}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-ink-850 border border-white/10 hover:border-accent-yellow hover:bg-ink-800 transition-all text-xs font-mono text-ivory-200 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText size={16} className="text-accent-yellow" />
                      <span>Download Resume (PDF)</span>
                    </div>
                    <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  <a
                    href={profile.leetcode}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-ink-850 border border-white/10 hover:border-white/30 hover:bg-ink-800 transition-all text-xs font-mono text-ivory-200 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-accent-yellow font-bold text-sm">LC</span>
                      <span>LeetCode Profile</span>
                    </div>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-ivory-400">
                  Location: Vadodara, Gujarat, India (UTC +05:30)
                </span>
                <a
                  href={`mailto:${profile.email}?subject=${encodeURIComponent("Project Collaboration – Sai Deepak")}&body=${encodeURIComponent("Hi Sai Deepak,\r\n\r\nI came across your portfolio and would like to discuss a potential project or collaboration.\r\n\r\nProject details:\r\n\r\nLooking forward to hearing from you.")}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-yellow text-ink-950 font-mono text-xs font-bold hover:bg-accent-yellowLight transition-colors"
                >
                  <Mail size={13} />
                  <span>START A PROJECT</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

