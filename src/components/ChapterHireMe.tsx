import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ExternalLink,
  Github,
  Linkedin,
  FileText,
  ArrowUpRight,
  Move,
  RotateCcw,
  Mail
} from "lucide-react";
import { profile } from "../data";
import { usePortfolioData } from "../context/PortfolioContext";
import { ContactFormModal } from "./ContactFormModal";

gsap.registerPlugin(ScrollTrigger);

// Exact 2D Point Rotation around an arbitrary pivot point
function rotatePoint(
  px: number,
  py: number,
  cx: number,
  cy: number,
  deg: number
): { x: number; y: number } {
  if (deg === 0) return { x: px, y: py };
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = px - cx;
  const dy = py - cy;
  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos
  };
}

export function ChapterHireMe() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { bio } = usePortfolioData();
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Single Coordinated State System for Hand, Fingers, Strings, and Button
  const [handState, setHandState] = useState({ x: 0, y: 0, rotate: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isActivated, setIsActivated] = useState(false); // Transitions into Dark Contact Screen

  // High-performance refs to eliminate state lags and race conditions
  const handStateRef = useRef({ x: 0, y: 0, rotate: 0 });
  const isDraggingRef = useRef(false);
  const isHoveringRef = useRef(false);
  const grabOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Pull activation threshold (pulling 85px to the left triggers contact form)
  const THRESHOLD_PULL_LEFT = 85;

  const hX = handState.x;
  const hY = handState.y;
  const hR = handState.rotate;

  // Real-time tension calculation based on 2D position
  const tension = Math.max(0, Math.min(1, -hX / THRESHOLD_PULL_LEFT));

  // Button reacts to both X and Y movement (reacting stronger during direct drag than normal tracking)
  const trackingBtnFactor = isDragging ? 1.0 : 0.45;
  const btnX = hX * (0.44 * trackingBtnFactor);
  const btnY = hY * (0.35 * trackingBtnFactor);
  const btnRotate = ((hX / 200) * 6 + (hY / 100) * 2) * trackingBtnFactor;

  // String sag tightens to taut straight lines as tension reaches 1
  const currentSag = Math.max(1, (1 - tension) * 20);

  // Wrist origin in SVG space: used as center of hand rotation
  const wristCx = 230 + hX;
  const wristCy = 210 + hY;

  // Fingertip coordinates mathematically rotated with the hand in full 2D space
  const f1 = rotatePoint(335 + hX, 184 + hY, wristCx, wristCy, hR); // Thumb tip
  const f2 = rotatePoint(350 + hX, 194 + hY, wristCx, wristCy, hR); // Index tip
  const f3 = rotatePoint(356 + hX, 212 + hY, wristCx, wristCy, hR); // Middle tip
  const f4 = rotatePoint(346 + hX, 230 + hY, wristCx, wristCy, hR); // Ring tip
  const f5 = rotatePoint(330 + hX, 246 + hY, wristCx, wristCy, hR); // Pinky tip

  // Button center & attachment points on its left rounded rim
  const btnCenterX = 710 + btnX;
  const btnCenterY = 210 + btnY;

  // Attachment points on left rim of pill button (rotated with button tilt)
  const b1 = rotatePoint(btnCenterX - 110, btnCenterY - 24, btnCenterX, btnCenterY, btnRotate);
  const b2 = rotatePoint(btnCenterX - 117, btnCenterY - 12, btnCenterX, btnCenterY, btnRotate);
  const b3 = rotatePoint(btnCenterX - 120, btnCenterY, btnCenterX, btnCenterY, btnRotate); // Apex
  const b4 = rotatePoint(btnCenterX - 117, btnCenterY + 12, btnCenterX, btnCenterY, btnRotate);
  const b5 = rotatePoint(btnCenterX - 110, btnCenterY + 24, btnCenterX, btnCenterY, btnRotate);

  // Suit Sleeve & Shirt Cuff connection points: locked seamlessly to the wrist under rotation
  const wTop = rotatePoint(200 + hX, 146 + hY, wristCx, wristCy, hR);
  const wBot = rotatePoint(195 + hX, 274 + hY, wristCx, wristCy, hR);
  const seamTop = rotatePoint(185 + hX, 147 + hY, wristCx, wristCy, hR);
  const seamBot = rotatePoint(180 + hX, 273 + hY, wristCx, wristCy, hR);
  const cuffTop = rotatePoint(230 + hX, 151 + hY, wristCx, wristCy, hR);
  const cuffBot = rotatePoint(224 + hX, 271 + hY, wristCx, wristCy, hR);
  const cufflink = rotatePoint(212 + hX, 209 + hY, wristCx, wristCy, hR);

  // 5 Curved strings dynamically adjusting their curves to the 2D hand position
  const d1 = `M ${f1.x} ${f1.y} Q ${(f1.x + b1.x) * 0.5} ${(f1.y + b1.y) * 0.5 - currentSag * 1.1} ${b1.x} ${b1.y}`;
  const d2 = `M ${f2.x} ${f2.y} Q ${(f2.x + b2.x) * 0.5} ${(f2.y + b2.y) * 0.5 - currentSag * 0.5} ${b2.x} ${b2.y}`;
  const d3 = `M ${f3.x} ${f3.y} Q ${(f3.x + b3.x) * 0.5} ${(f3.y + b3.y) * 0.5 + currentSag * 0.3} ${b3.x} ${b3.y}`;
  const d4 = `M ${f4.x} ${f4.y} Q ${(f4.x + b4.x) * 0.5} ${(f4.y + b4.y) * 0.5 + currentSag * 0.9} ${b4.x} ${b4.y}`;
  const d5 = `M ${f5.x} ${f5.y} Q ${(f5.x + b5.x) * 0.5} ${(f5.y + b5.y) * 0.5 + currentSag * 1.5} ${b5.x} ${b5.y}`;

  // W3C Standard Method: Convert screen client coordinates to SVG viewBox space
  const getSvgPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const inverse = ctm.inverse();
    const transformed = pt.matrixTransform(inverse);
    return { x: transformed.x, y: transformed.y };
  };

  // Heading and interactive canvas scroll entrance animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      if (svgRef.current) {
        gsap.fromTo(
          svgRef.current,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: svgRef.current,
              start: "top 88%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Escape key listener to close contact screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isActivated) {
        setIsActivated(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActivated]);

  // =========================================================================
  // 1. AUTOMATIC MOUSE TRACKING (WITHOUT CLICKING)
  // Tracks cursor everywhere inside the section with smooth natural delay
  // =========================================================================
  const handleSectionPointerMove = (e: React.PointerEvent) => {
    // If the user is currently direct-dragging the hand, dragging takes absolute priority
    if (isDraggingRef.current) return;
    // Touchscreen devices do not have a hover cursor; they interact via direct touch-drag
    if (e.pointerType === "touch") return;

    const svgPt = getSvgPoint(e.clientX, e.clientY);
    // Resting center of the hand in SVG coordinate space is around (280, 210)
    const dx = svgPt.x - 280;
    const dy = svgPt.y - 210;

    // Organic bounds and natural damping for automatic hover-follow
    const targetX = Math.max(-85, Math.min(85, dx * 0.28));
    const targetY = Math.max(-55, Math.min(55, dy * 0.28));
    const targetRotate = (targetX / 100) * 6 + (targetY / 80) * 8;

    isHoveringRef.current = true;
    if (tweenRef.current) tweenRef.current.kill();

    const proxy = { ...handStateRef.current };
    tweenRef.current = gsap.to(proxy, {
      x: targetX,
      y: targetY,
      rotate: targetRotate,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
      onUpdate: () => {
        handStateRef.current = { x: proxy.x, y: proxy.y, rotate: proxy.rotate };
        setHandState({ x: proxy.x, y: proxy.y, rotate: proxy.rotate });
      }
    });
  };

  const handleSectionPointerLeave = (e: React.PointerEvent) => {
    if (isDraggingRef.current) return;
    isHoveringRef.current = false;
    if (tweenRef.current) tweenRef.current.kill();

    const proxy = { ...handStateRef.current };
    tweenRef.current = gsap.to(proxy, {
      x: 0,
      y: 0,
      rotate: 0,
      duration: 0.75,
      ease: "power2.out",
      onUpdate: () => {
        handStateRef.current = { x: proxy.x, y: proxy.y, rotate: proxy.rotate };
        setHandState({ x: proxy.x, y: proxy.y, rotate: proxy.rotate });
      }
    });
  };

  // =========================================================================
  // 2. DIRECT CLICK-AND-DRAG INTERACTION
  // Grabs the hand directly, follows pointer 1:1, triggers pull threshold
  // =========================================================================
  const handleHandPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (tweenRef.current) tweenRef.current.kill();

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    setIsDragging(true);

    const svgPt = getSvgPoint(e.clientX, e.clientY);
    // Preserve exact grab offset so hand never jumps when grabbed
    grabOffsetRef.current = {
      x: svgPt.x - handStateRef.current.x,
      y: svgPt.y - handStateRef.current.y
    };
  };

  const handleHandPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const svgPt = getSvgPoint(e.clientX, e.clientY);
    const targetX = svgPt.x - grabOffsetRef.current.x;
    const targetY = svgPt.y - grabOffsetRef.current.y;

    // Full 2D freedom (left, right, up, down)
    const clampedX = Math.max(-250, Math.min(130, targetX));
    const clampedY = Math.max(-110, Math.min(110, targetY));
    const dragRotate = (clampedX / 180) * 8 + (clampedY / 100) * 10;

    // Direct 1:1 instant tracking without lag
    handStateRef.current = { x: clampedX, y: clampedY, rotate: dragRotate };
    setHandState({ x: clampedX, y: clampedY, rotate: dragRotate });
  };

  const handleHandPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    isDraggingRef.current = false;
    setIsDragging(false);

    // If pulled left past threshold, trigger contact form!
    if (handStateRef.current.x <= -THRESHOLD_PULL_LEFT) {
      setIsActivated(true);
      handStateRef.current = { x: 0, y: 0, rotate: 0 };
      setHandState({ x: 0, y: 0, rotate: 0 });
    } else {
      // Released before threshold: spring smoothly back
      const proxy = { ...handStateRef.current };
      tweenRef.current = gsap.to(proxy, {
        x: 0,
        y: 0,
        rotate: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.45)",
        onUpdate: () => {
          handStateRef.current = { x: proxy.x, y: proxy.y, rotate: proxy.rotate };
          setHandState({ x: proxy.x, y: proxy.y, rotate: proxy.rotate });
        }
      });
    }
  };

  return (
    <section
      id="hire-me"
      ref={sectionRef}
      onPointerMove={handleSectionPointerMove}
      onPointerLeave={handleSectionPointerLeave}
      className={`relative w-full py-20 sm:py-28 md:py-32 transition-colors duration-700 select-none overflow-hidden border-b ${
        isActivated
          ? "bg-[#0a0a0c] text-ivory-100 border-white/10"
          : "bg-[#EAE8E2] text-[#0a0a0c] border-[#dedad0]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <AnimatePresence mode="wait">
          {!isActivated ? (
            /* 1. INITIAL INTERACTIVE CANVAS: FULL 2D DRAG-TO-PULL HAND & HIRE ME BUTTON */
            <motion.div
              key="interactive-pull-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
            >
              {/* SECTION HEADING */}
              <div ref={headlineRef} className="mb-4 sm:mb-8">
                <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-[#66635a] uppercase mb-3">
                  <span className="w-2.5 h-2.5 bg-[#0a0a0c] inline-block" />
                  <span>CH. 06 — COLLABORATE</span>
                </div>

                <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[90px] font-condensed font-extrabold text-[#0a0a0c] tracking-tight leading-[0.90] uppercase">
                  PULL ME INTO
                </h2>
                <div className="text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-serif italic font-normal text-[#2b2a26] mt-1 leading-[1]">
                  your team.
                </div>
              </div>

              {/* INTERACTION STATUS CUE */}
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    tension >= 0.8
                      ? "bg-[#e2ee5a] text-[#0a0a0c] shadow-[0_0_20px_rgba(226,238,90,0.6)] animate-pulse"
                      : "bg-black/10 text-[#0a0a0c]"
                  }`}
                >
                  <Move size={14} className={isDragging ? "animate-spin" : ""} />
                  <span>
                    {isDragging
                      ? tension >= 0.8
                        ? "RELEASE TO OPEN CONTACT SECTION!"
                        : `PULLING... ${Math.round(tension * 100)}%`
                      : "HOVER TO GUIDE • GRAB & DRAG TO PULL"}
                  </span>
                </div>
              </div>

              {/* MAIN INTERACTIVE STAGE */}
              <div className="relative w-full max-w-5xl h-[340px] sm:h-[420px] md:h-[460px] mx-auto flex items-center justify-center my-2 sm:my-4">
                {/* FLOATING KINETIC WORDS: Appear dynamically as tension increases */}
                <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                  <span
                    style={{
                      opacity: tension > 0.35 ? (tension - 0.35) * 1.5 : 0,
                      transform: `translate(${-tension * 18}px, ${-tension * 12}px) rotate(-8deg)`
                    }}
                    className="absolute top-[12%] right-[32%] sm:right-[36%] font-display font-extrabold text-lg sm:text-2xl md:text-3xl text-[#0a0a0c] tracking-tight transition-all duration-150"
                  >
                    TOGETHER
                  </span>

                  <span
                    style={{
                      opacity: tension > 0.4 ? (tension - 0.4) * 1.6 : 0,
                      transform: `translate(${tension * 12}px, ${-tension * 8}px) rotate(12deg)`
                    }}
                    className="absolute top-[16%] right-[10%] sm:right-[16%] font-display font-extrabold text-base sm:text-xl md:text-2xl text-[#0a0a0c] tracking-tight transition-all duration-150"
                  >
                    HELLO
                  </span>

                  <span
                    style={{
                      opacity: tension > 0.25 ? (tension - 0.25) * 1.4 : 0,
                      transform: `translate(${-tension * 22}px, 0px) rotate(-4deg)`
                    }}
                    className="absolute top-[28%] left-[44%] sm:left-[42%] font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-[#0a0a0c] tracking-tight transition-all duration-150"
                  >
                    SHIP
                  </span>

                  <span
                    style={{
                      opacity: tension > 0.3 ? (tension - 0.3) * 1.5 : 0,
                      transform: `translate(${-tension * 14}px, ${tension * 12}px) rotate(-6deg)`
                    }}
                    className="absolute bottom-[16%] right-[38%] sm:right-[42%] font-display font-extrabold text-xl sm:text-3xl md:text-4xl text-[#0a0a0c] tracking-tight transition-all duration-150"
                  >
                    BUILD
                  </span>

                  <span
                    style={{
                      opacity: tension > 0.2 ? (tension - 0.2) * 1.3 : 0,
                      transform: `translate(${tension * 16}px, ${tension * 14}px) rotate(1deg)`
                    }}
                    className="absolute bottom-[14%] right-[16%] sm:right-[22%] font-display font-extrabold text-2xl sm:text-4xl md:text-5xl text-[#e24a4a] tracking-tight transition-all duration-150"
                  >
                    TALK
                  </span>

                  <span
                    style={{
                      opacity: tension > 0.45 ? (tension - 0.45) * 1.8 : 0,
                      transform: `translate(${tension * 20}px, 0px) rotate(-3deg)`
                    }}
                    className="absolute top-[48%] right-[6%] sm:right-[12%] font-display font-extrabold text-lg sm:text-2xl md:text-3xl text-[#0a0a0c] tracking-tight transition-all duration-150"
                  >
                    LET'S
                  </span>
                </div>

                {/* SVG CANVAS */}
                <svg
                  ref={svgRef}
                  viewBox="0 0 920 420"
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="btnGlossGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
                      <stop offset="45%" stopColor="#ffffff" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>

                    <linearGradient id="pullLightSweep" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>

                    <filter id="btnShadow" x="-25%" y="-25%" width="150%" height="150%">
                      <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#000000" floodOpacity="0.4" />
                    </filter>
                  </defs>

                  {/* STRINGS: Real-time curves connecting fingertips and button */}
                  <g stroke="#0a0a0c" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d={d1} strokeWidth="1.6" opacity="0.9" />
                    <path d={d2} strokeWidth="1.8" opacity="0.95" />
                    <path d={d3} strokeWidth="2.0" opacity="1.0" />
                    <path d={d4} strokeWidth="1.7" opacity="0.9" />
                    <path d={d5} strokeWidth="1.5" opacity="0.85" />
                  </g>

                  {/* SUIT SLEEVE: Anchored on the left, flexibly stretches and rotates with the wrist */}
                  <g id="suit-sleeve" className="pointer-events-none">
                    <path
                      d={`M -40 142 L ${wTop.x} ${wTop.y} L ${wBot.x} ${wBot.y} L -40 270 Z`}
                      fill="#121216"
                      stroke="#0a0a0c"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <line
                      x1={seamTop.x}
                      y1={seamTop.y}
                      x2={seamBot.x}
                      y2={seamBot.y}
                      stroke="#25252c"
                      strokeWidth="2"
                    />

                    {/* White Shirt Cuff following rotated 2D wrist */}
                    <path
                      d={`M ${wTop.x} ${wTop.y} L ${cuffTop.x} ${cuffTop.y} L ${cuffBot.x} ${cuffBot.y} L ${wBot.x} ${wBot.y} Z`}
                      fill="#ffffff"
                      stroke="#0a0a0c"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    {/* Dark Cufflink */}
                    <circle cx={cufflink.x} cy={cufflink.y} r="4" fill="#121216" stroke="#dedad0" strokeWidth="1" />
                  </g>

                  {/* DRAGGABLE & HOVER-TRACKING HAND: Follows cursor automatically on hover, and directly on grab */}
                  <g
                    id="draggable-hand"
                    transform={`translate(${hX}, ${hY}) rotate(${hR}, 230, 210)`}
                    onPointerDown={handleHandPointerDown}
                    onPointerMove={handleHandPointerMove}
                    onPointerUp={handleHandPointerUp}
                    onPointerCancel={handleHandPointerUp}
                    className={`${
                      isDragging ? "cursor-grabbing" : "cursor-grab"
                    } touch-none select-none`}
                    style={{ touchAction: "none" }}
                  >
                    {/* Generous grab hit-area */}
                    <rect
                      x="160"
                      y="120"
                      width="240"
                      height="180"
                      fill="transparent"
                      className="cursor-grab active:cursor-grabbing"
                    />

                    {/* Hand Contour */}
                    <path
                      d="M 230 162
                         C 265 155, 295 160, 320 172
                         C 330 176, 335 180, 335 184
                         L 350 194
                         C 356 199, 354 205, 348 208
                         L 356 212
                         C 362 217, 360 224, 352 227
                         L 346 230
                         C 350 236, 346 242, 338 244
                         L 330 246
                         C 334 252, 328 257, 318 256
                         C 295 254, 260 252, 224 246 Z"
                      fill="#EAE5DC"
                      stroke="#0a0a0c"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Finger Lines terminating directly at the 5 string anchor points */}
                    <path d="M 265 180 C 290 170, 315 174, 335 184" fill="none" stroke="#0a0a0c" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 295 190 C 315 190, 335 196, 350 194" fill="none" stroke="#0a0a0c" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 298 206 C 318 208, 338 214, 356 212" fill="none" stroke="#0a0a0c" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 290 222 C 310 226, 328 230, 346 230" fill="none" stroke="#0a0a0c" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 280 236 C 298 240, 314 244, 330 246" fill="none" stroke="#0a0a0c" strokeWidth="2" strokeLinecap="round" />

                    {/* Realistic Palm Creases */}
                    <path d="M 245 185 C 260 195, 275 205, 285 225" fill="none" stroke="#0a0a0c" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M 265 180 C 275 190, 285 198, 292 215" fill="none" stroke="#0a0a0c" strokeWidth="1.4" strokeLinecap="round" />
                  </g>

                  {/* GLOSSY HIRE ME BUTTON (Pulls toward the hand in 2D) */}
                  <g
                    id="hire-me-button"
                    transform={`translate(${btnCenterX}, ${btnCenterY}) rotate(${btnRotate}) translate(${-btnCenterX}, ${-btnCenterY})`}
                    filter="url(#btnShadow)"
                    className="cursor-pointer"
                    onClick={() => setIsActivated(true)}
                    role="button"
                    tabIndex={0}
                    aria-label="Open contact form"
                  >
                    {/* Outer Bezel */}
                    <rect
                      x={btnCenterX - 118}
                      y={btnCenterY - 41}
                      width="236"
                      height="82"
                      rx="41"
                      fill="#070709"
                      stroke={tension >= 0.8 ? "#e2ee5a" : "#2a2a32"}
                      strokeWidth="2.5"
                    />

                    {/* Inner Jet-Black Glossy Body */}
                    <rect
                      x={btnCenterX - 115}
                      y={btnCenterY - 38}
                      width="230"
                      height="76"
                      rx="38"
                      fill="#0a0a0c"
                    />

                    {/* Specular Top Arc Highlight */}
                    <path
                      d={`M ${btnCenterX - 95} ${btnCenterY - 35} Q ${btnCenterX} ${btnCenterY - 37} ${btnCenterX + 95} ${btnCenterY - 35} C ${btnCenterX + 85} ${btnCenterY - 14}, ${btnCenterX - 85} ${btnCenterY - 14}, ${btnCenterX - 95} ${btnCenterY - 35} Z`}
                      fill="url(#btnGlossGrad)"
                    />

                    {/* Dynamic Light Sweep on Drag */}
                    <rect
                      x={btnCenterX - 114}
                      y={btnCenterY - 37}
                      width="228"
                      height="74"
                      rx="37"
                      fill="url(#pullLightSweep)"
                      opacity={tension}
                      className="pointer-events-none"
                    />

                    {/* "HIRE ME" Typography */}
                    <text
                      x={btnCenterX}
                      y={btnCenterY + 9}
                      textAnchor="middle"
                      className="font-condensed font-extrabold uppercase text-white tracking-widest text-[30px] sm:text-[34px] select-none pointer-events-none"
                      style={{ fontFamily: "'Oswald', 'Bebas Neue', 'Barlow Condensed', sans-serif" }}
                      fill={tension >= 0.8 ? "#e2ee5a" : "#ffffff"}
                    >
                      HIRE ME
                    </text>

                    {/* Accent Yellow Dot */}
                    <circle cx={btnCenterX + 82} cy={btnCenterY - 16} r="3" fill="#e2ee5a" />
                  </g>
                </svg>

                {/* Mobile Direct Tap Alternative */}
                <div className="md:hidden flex flex-col items-center gap-2 mt-4 px-2">
                  <button
                    type="button"
                    onClick={() => setIsActivated(true)}
                    className="w-full max-w-sm py-3.5 px-6 bg-[#0a0a0c] border border-[#e2ee5a]/40 text-[#e2ee5a] hover:bg-[#e2ee5a] hover:text-[#0a0a0c] font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(226,238,90,0.15)] flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] active:scale-95"
                  >
                    <span>TAP TO CONNECT / HIRE ME</span>
                    <ArrowUpRight size={14} />
                  </button>
                  <span className="text-[10px] font-mono text-ivory-400/60 uppercase tracking-wider">
                    TAP BUTTON OR DRAG HAND TO CONNECT
                  </span>
                </div>
              </div>

              {/* FOOTER SECTION: "PREFER IT PLAIN?" */}
              <div className="mt-8 pt-8 border-t border-[#dedad0] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#5c5a53]">
                <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                  <span className="font-bold text-[#0a0a0c]">PREFER IT PLAIN?</span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-[#0a0a0c] hover:underline transition-all font-medium"
                  >
                    {profile.email}
                  </a>
                  <a
                    href="/Sai_Deepak_Ambati_Resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#0a0a0c] transition-colors"
                  >
                    Résumé (PDF)
                  </a>
                  <a
                    href="https://github.com/callsydeepu"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#0a0a0c] transition-colors"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/sai-deepak-ambati-85454b31b/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#0a0a0c] transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>

                <div className="text-[11px] text-[#78756d] uppercase tracking-wider">
                  PARUL UNIVERSITY, VADODARA
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dark-contact-screen"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl mx-auto py-8 sm:py-16 md:py-20 px-2 sm:px-0"
            >
              {/* Top Bar with Chapter Badge & Dismiss Pill */}
              <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-white/10 mb-8 sm:mb-14">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#e2ee5a] font-bold">
                    <span className="w-2 h-2 bg-[#e2ee5a] inline-block shadow-[0_0_8px_#e2ee5a]" />
                    <span>CH. 06 — THE CLOSE</span>
                  </div>
                  <div className="text-[10px] sm:text-xs font-mono text-ivory-400 uppercase tracking-widest block">
                    PROJECT INQUIRY &amp; DIRECT COLLABORATION
                  </div>
                </div>

                {/* Reset / Close Button */}
                <button
                  type="button"
                  onClick={() => setIsActivated(false)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-[#e2ee5a] hover:text-[#0a0a0c] text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer text-white min-h-[36px]"
                  aria-label="Close contact overlay"
                >
                  <RotateCcw size={12} />
                  <span>CLOSE / RESET</span>
                </button>
              </div>

              {/* Master Headline */}
              <div className="mb-8 sm:mb-14">
                <h2 className="text-3xl sm:text-6xl md:text-7xl lg:text-[76px] font-serif italic font-normal text-white leading-[1.08] sm:leading-[1.05] tracking-tight">
                  Let's talk about what <br />
                  <span className="text-[#e2ee5a]">I can build for you.</span>
                </h2>

                {/* Name, Professional Role & Editorial Summary */}
                <div className="mt-6 sm:mt-10 max-w-2xl space-y-2.5 sm:space-y-3">
                  <div className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#e2ee5a]">
                    AMBATI SAI DEEPAK // AI ENGINEER &amp; FULL-STACK DEVELOPER
                  </div>
                  <p className="text-sm sm:text-lg text-ivory-300 font-sans leading-relaxed">
                    I turn ideas into working products — LangGraph multi-agent systems, RAG engines, FastAPI backends, Dockerized deployments, and LLM-powered features — built with careful engineering and a feel for motion.
                  </p>
                </div>
              </div>

              {/* Primary Visual Focus: Prominent START A PROJECT CTA + DIRECT MESSAGE */}
              <div className="mb-12 sm:mb-24 pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-6 flex-wrap">
                <a
                  href={`mailto:${bio.email || profile.email}?subject=${encodeURIComponent("Project Collaboration – Sai Deepak")}`}
                  className="group relative inline-flex items-center justify-center gap-3 px-6 sm:px-12 py-4 sm:py-5 bg-[#e2ee5a] hover:bg-white text-[#0a0a0c] font-condensed font-extrabold text-base sm:text-xl md:text-2xl uppercase tracking-wider transition-all duration-300 shadow-[0_0_35px_rgba(226,238,90,0.35)] hover:shadow-[0_0_55px_rgba(226,238,90,0.65)] active:scale-[0.98] select-none min-h-[48px] text-center"
                >
                  <span>START A PROJECT</span>
                  <ArrowUpRight
                    size={20}
                    className="text-[#0a0a0c] group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-transform duration-200"
                  />
                </a>

                <button
                  type="button"
                  onClick={() => setContactModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-8 py-3.5 sm:py-5 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#e2ee5a] text-white font-condensed font-bold text-sm sm:text-lg uppercase tracking-wider transition-all cursor-pointer min-h-[48px]"
                >
                  <Mail size={16} className="text-[#e2ee5a]" />
                  <span>SEND DIRECT MESSAGE</span>
                </button>

                <div className="flex items-center gap-2.5 text-xs font-mono text-ivory-400 uppercase tracking-widest pl-2">
                  <span className="w-2 h-2 rounded-full bg-[#e2ee5a] animate-ping" />
                  <span>DIRECT INQUIRIES &amp; COLLABORATIONS</span>
                </div>
              </div>

              {/* Bottom Verified Dossier Links */}
              <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-ivory-400">
                <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                  <a
                    href="https://www.linkedin.com/in/sai-deepak-ambati-85454b31b/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#e2ee5a] flex items-center gap-1.5 transition-colors"
                  >
                    <Linkedin size={14} />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://github.com/callsydeepu"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#e2ee5a] flex items-center gap-1.5 transition-colors"
                  >
                    <Github size={14} />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://leetcode.com/u/sai_deepak2005/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#e2ee5a] flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink size={14} />
                    <span>LeetCode</span>
                  </a>
                  <a
                    href="/Sai_Deepak_Ambati_Resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#e2ee5a] flex items-center gap-1.5 transition-colors"
                  >
                    <FileText size={14} />
                    <span>Résumé (PDF)</span>
                  </a>
                </div>

                <div className="text-[11px] text-ivory-400/60 uppercase tracking-wider">
                  PARUL UNIVERSITY, VADODARA
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Public Direct Contact Form Modal */}
        <ContactFormModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
        />
      </div>
    </section>
  );
}
