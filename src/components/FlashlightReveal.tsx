import React, { useRef, useEffect, useState, useCallback } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";

interface FlashlightRevealProps {
  children?: React.ReactNode;
  revealContent: React.ReactNode;
  baseContent: React.ReactNode;
  beamRadius?: number;
  className?: string;
  label?: string;
  showToggle?: boolean;
}

export function FlashlightReveal({
  revealContent,
  baseContent,
  beamRadius = 220,
  className = "",
  label = "EDITORIAL INSPECTOR // HOVER TO REVEAL BLUEPRINT",
  showToggle = true
}: FlashlightRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const targetPos = useRef<{ x: number; y: number } | null>(null);
  const [isRevealedFull, setIsRevealedFull] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const updateCssVariables = useCallback(() => {
    if (!containerRef.current || !targetPos.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = targetPos.current.x - rect.left;
    const y = targetPos.current.y - rect.top;

    containerRef.current.style.setProperty("--torch-x", `${x}px`);
    containerRef.current.style.setProperty("--torch-y", `${y}px`);
    rafId.current = null;
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    targetPos.current = { x: e.clientX, y: e.clientY };
    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(updateCssVariables);
    }
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsHovered(true);
    targetPos.current = { x: e.clientX, y: e.clientY };
    if (containerRef.current) {
      containerRef.current.style.setProperty("--torch-opacity", "1");
    }
    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(updateCssVariables);
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (containerRef.current) {
      containerRef.current.style.setProperty("--torch-opacity", "0");
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      targetPos.current = { x: touch.clientX, y: touch.clientY };
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(updateCssVariables);
      }
    }
  };

  // Initialize initial beam coordinates to center
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      containerRef.current.style.setProperty("--torch-x", `${rect.width * 0.5}px`);
      containerRef.current.style.setProperty("--torch-y", `${rect.height * 0.5}px`);
      containerRef.current.style.setProperty("--torch-size", `${beamRadius}px`);
      containerRef.current.style.setProperty("--torch-opacity", prefersReducedMotion ? "1" : "0");
    }
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [beamRadius, prefersReducedMotion]);

  const fullyRevealed = isRevealedFull || prefersReducedMotion;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onTouchStart={() => setIsHovered(true)}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-ink-900 select-none ${className}`}
      style={
        {
          "--torch-size": `${beamRadius}px`,
          "--torch-opacity": "0"
        } as React.CSSProperties
      }
    >
      {/* Base Layer: visible standard dark layer */}
      <div className="relative z-10 w-full h-full pointer-events-auto">
        {baseContent}
      </div>

      {/* Reveal Layer: exposed only under the flashlight beam */}
      <div
        className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ${
          fullyRevealed ? "opacity-100" : ""
        }`}
        style={
          fullyRevealed
            ? { maskImage: "none", WebkitMaskImage: "none", opacity: 1 }
            : {
                WebkitMaskImage:
                  "radial-gradient(circle var(--torch-size) at var(--torch-x) var(--torch-y), rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0) 100%)",
                maskImage:
                  "radial-gradient(circle var(--torch-size) at var(--torch-x) var(--torch-y), rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0) 100%)",
                opacity: isHovered ? "var(--torch-opacity, 1)" : 0
              }
        }
      >
        {revealContent}
      </div>

      {/* Realistic Beam Ambient Glow */}
      {!fullyRevealed && (
        <div
          className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle var(--torch-size) at var(--torch-x) var(--torch-y), rgba(229,193,88,0.12) 0%, rgba(229,193,88,0.04) 45%, transparent 70%)",
            opacity: isHovered ? 1 : 0
          }}
        />
      )}

      {/* Soft spotlight center ping */}
      {!fullyRevealed && isHovered && (
        <div
          className="absolute z-35 pointer-events-none rounded-full w-4 h-4 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
          style={{
            left: "var(--torch-x)",
            top: "var(--torch-y)",
            background: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(229,193,88,0) 100%)",
            boxShadow: "0 0 20px 4px rgba(229,193,88,0.4)"
          }}
        />
      )}

      {/* Editorial HUD & Accessibility Toggle */}
      <div className="absolute top-3 right-3 z-40 flex items-center gap-2">
        {showToggle && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsRevealedFull(!isRevealedFull);
            }}
            aria-label={fullyRevealed ? "Enable interactive torchlight" : "Reveal all hidden blueprints"}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono tracking-wider rounded-md bg-ink-850/90 text-ivory-200 border border-white/10 hover:border-accent-yellow hover:text-accent-yellow transition-colors backdrop-blur-sm shadow-md"
          >
            {fullyRevealed ? <EyeOff size={12} /> : <Eye size={12} />}
            <span>{fullyRevealed ? "RESET TORCH" : "REVEAL ALL"}</span>
          </button>
        )}
      </div>

      {/* Editorial Caption Bar at Bottom */}
      <div className="absolute bottom-2 left-3 z-40 flex items-center gap-2 text-[9px] font-mono text-ivory-400/70 tracking-widest pointer-events-none">
        <Sparkles size={10} className="text-accent-yellow" />
        <span>{label}</span>
      </div>
    </div>
  );
}

