import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePortfolioData } from "../context/PortfolioContext";

gsap.registerPlugin(ScrollTrigger);

interface TechLine {
  highlight?: string;
  items: string[];
}

interface TechGroup {
  category: string;
  sublabel?: string;
  lines: TechLine[];
}

// User's verified skills directly from resume (no extra skills)
const defaultTechStackGroups: TechGroup[] = [
  {
    category: "PROGRAMMING LANGUAGES",
    sublabel: "PRIMARY //",
    lines: [
      {
        highlight: "PYTHON",
        items: ["JAVASCRIPT", "SQL", "C++"]
      }
    ]
  },
  {
    category: "AI & MACHINE LEARNING",
    lines: [
      {
        items: ["MACHINE LEARNING", "DEEP LEARNING"]
      },
      {
        items: ["LLMS", "RAG", "LANGCHAIN", "LANGGRAPH"]
      }
    ]
  },
  {
    category: "BACKEND & APIS",
    lines: [
      {
        items: ["FASTAPI", "NODE.JS", "EXPRESS.JS"]
      },
      {
        items: ["RESTFUL APIS", "JWT AUTH", "MICROSERVICES"]
      }
    ]
  },
  {
    category: "DATABASES",
    lines: [
      {
        items: ["MONGODB", "MYSQL", "REDIS", "QDRANT"]
      }
    ]
  },
  {
    category: "DATA ANALYSIS",
    lines: [
      {
        items: ["PANDAS", "NUMPY", "STREAMLIT"]
      }
    ]
  },
  {
    category: "TOOLS & CLOUD",
    lines: [
      {
        items: ["GIT", "GITHUB", "DOCKER", "AWS", "POSTMAN"]
      }
    ]
  }
];

export function ChapterToolkit() {
  const { techStackGroups: dynamicGroups } = usePortfolioData();
  const techStackGroups = dynamicGroups && dynamicGroups.length > 0 ? dynamicGroups : defaultTechStackGroups;

  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const yellowCurtainRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Respect user's prefers-reduced-motion accessibility preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        const masks = rowsRef.current?.querySelectorAll<HTMLElement>(".kinetic-mask");
        masks?.forEach((m) => {
          m.style.overflow = "visible";
        });
        return;
      }

      const isMobile = window.innerWidth < 640;

      // 1. Initial Header Appearance
      if (badgeRef.current && headingRef.current) {
        gsap.fromTo(
          [badgeRef.current, headingRef.current],
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // 2. Kinetic Typography Reveal for Each Category Row Independently
      const rows = rowsRef.current?.querySelectorAll<HTMLElement>(".tech-stack-row");

      rows?.forEach((row) => {
        const label = row.querySelector(".category-label");
        const sublabel = row.querySelector(".category-sublabel");
        const words = row.querySelectorAll<HTMLElement>(".kinetic-word");
        const masks = row.querySelectorAll<HTMLElement>(".kinetic-mask");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 86%",
            toggleActions: "play none none reverse",
            fastScrollEnd: true,
            onLeaveBack: () => {
              masks.forEach((m) => {
                m.style.overflow = "hidden";
              });
            }
          }
        });

        // Step A: Category label reveals first
        if (label) {
          tl.fromTo(
            sublabel ? [label, sublabel] : label,
            { opacity: 0, y: isMobile ? 8 : 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "power2.out"
            }
          );
        }

        // Step B: Staggered Kinetic Typography reveal for individual technology words
        // Optimized: Uses GPU-accelerated transform & opacity; avoids heavy real-time CSS filter blurring
        if (words.length > 0) {
          tl.fromTo(
            words,
            {
              opacity: 0,
              y: isMobile ? 18 : 28
            },
            {
              opacity: 1,
              y: 0,
              duration: isMobile ? 0.45 : 0.55,
              stagger: isMobile ? 0.04 : 0.05,
              ease: "power3.out",
              force3D: true,
              onComplete: () => {
                // Allow magnifying hover to expand freely without mask clipping
                masks.forEach((m) => {
                  m.style.overflow = "visible";
                });
              }
            },
            "-=0.2" // smooth overlap with the category label reveal
          );
        }
      });

      // 3. High-Performance Magnifying Hover & Magnetic Effect (Using quickTo & GPU composited glow)
      const magnifyItems = rowsRef.current?.querySelectorAll<HTMLElement>(".tech-magnify-item");
      const cleanupFns: Array<() => void> = [];

      if (magnifyItems) {
        magnifyItems.forEach((el) => {
          const isHighlight = el.getAttribute("data-is-highlight") === "true";
          const glowEl = el.querySelector<HTMLElement>(".tech-glow");
          const labelEl = el.querySelector<HTMLElement>(".tech-label");

          // GSAP quickTo handles high-frequency pointer movement with ZERO tween allocation overhead
          const xTo = gsap.quickTo(el, "x", { duration: 0.22, ease: "power2.out" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.22, ease: "power2.out" });

          let isHovered = false;
          let centerX = 0;
          let centerY = 0;

          const onEnter = (e: PointerEvent) => {
            isHovered = true;

            // Ensure parent mask does not clip during hover expansion
            const parentMask = el.closest<HTMLElement>(".kinetic-mask");
            if (parentMask) {
              parentMask.style.overflow = "visible";
            }

            // Cache center coordinates ONCE on enter (avoids getBoundingClientRect in pointermove)
            const rect = el.getBoundingClientRect();
            centerX = rect.left + rect.width / 2;
            centerY = rect.top + rect.height / 2;

            // Elevate above surrounding elements
            el.style.zIndex = "40";

            // Magnify smoothly
            gsap.to(el, {
              scale: isMobile ? 1.15 : 1.22,
              backgroundColor: isHighlight ? "#ecf85e" : "transparent",
              duration: 0.24,
              ease: "power3.out",
              transformOrigin: "center center",
              overwrite: "auto",
              force3D: true
            });

            // Brighten text color
            if (labelEl) {
              gsap.to(labelEl, {
                color: "#000000",
                duration: 0.2,
                ease: "power2.out",
                overwrite: "auto"
              });
            }

            // Reveal GPU-composited yellow glow aura
            if (glowEl) {
              gsap.to(glowEl, {
                opacity: isHighlight ? 1 : 0.85,
                duration: 0.2,
                ease: "power2.out",
                overwrite: "auto"
              });
            }

            // Subtle initial pull towards entry position
            xTo((e.clientX - centerX) * 0.15);
            yTo((e.clientY - centerY) * 0.15);
          };

          const onMove = (e: PointerEvent) => {
            if (!isHovered) return;
            // Direct computation without any DOM queries or forced layout reflows
            xTo((e.clientX - centerX) * 0.15);
            yTo((e.clientY - centerY) * 0.15);
          };

          const onLeave = () => {
            isHovered = false;

            // Smoothly reset magnetic displacement
            xTo(0);
            yTo(0);

            // Reset scale and background
            gsap.to(el, {
              scale: 1,
              backgroundColor: isHighlight ? "#e2ee5a" : "transparent",
              duration: 0.28,
              ease: "power3.out",
              overwrite: "auto",
              force3D: true,
              onComplete: () => {
                if (!isHovered) {
                  el.style.zIndex = "";
                }
              }
            });

            // Reset text color
            if (labelEl) {
              gsap.to(labelEl, {
                color: isHighlight ? "#0a0a0c" : "#141416",
                duration: 0.24,
                ease: "power2.out",
                overwrite: "auto"
              });
            }

            // Fade out glow aura
            if (glowEl) {
              gsap.to(glowEl, {
                opacity: 0,
                duration: 0.24,
                ease: "power2.out",
                overwrite: "auto"
              });
            }
          };

          // Mobile touch interaction
          const onTouchStart = (e: TouchEvent) => {
            if (e.touches[0]) {
              onEnter({
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY
              } as PointerEvent);
            }
          };
          const onTouchEnd = () => {
            setTimeout(onLeave, 350);
          };

          el.addEventListener("pointerenter", onEnter);
          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerleave", onLeave);
          el.addEventListener("touchstart", onTouchStart, { passive: true });
          el.addEventListener("touchend", onTouchEnd, { passive: true });

          cleanupFns.push(() => {
            el.removeEventListener("pointerenter", onEnter);
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
            el.removeEventListener("touchstart", onTouchStart);
            el.removeEventListener("touchend", onTouchEnd);
          });
        });
      }

      // 4. Full-Width Yellow Transition Curtain (step_03_0.60s.jpg from reference video)
      if (yellowCurtainRef.current) {
        gsap.fromTo(
          yellowCurtainRef.current,
          { scaleY: 0.15, transformOrigin: "bottom center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: yellowCurtainRef.current,
              start: "top 95%",
              end: "bottom bottom",
              scrub: 0.8
            }
          }
        );
      }

      return () => {
        cleanupFns.forEach((fn) => fn());
      };
    },
    { scope: sectionRef, dependencies: [techStackGroups] }
  );

  return (
    <section
      ref={sectionRef}
      id="toolkit"
      className="pt-20 sm:pt-28 md:pt-32 pb-0 bg-[#f5f4ef] text-[#141416] select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* 1. Small Yellow / Black Rectangular Section Label (Frame 0.00s) */}
        <div
          ref={badgeRef}
          className="inline-block bg-[#e2ee5a] text-[#0a0a0c] px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider mb-4 rounded-none shadow-none"
        >
          CH. 03 — TOOLKIT
        </div>

        {/* 2. Main Heading: "WHAT I BUILD with." on the SAME LINE on desktop */}
        <div ref={headingRef} className="pb-8 border-b border-black/15 mb-12 sm:mb-16">
          <h2 className="flex flex-row flex-wrap md:flex-nowrap items-baseline gap-3 sm:gap-4">
            <span className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-condensed font-extrabold text-[#141416] tracking-tight uppercase leading-none">
              WHAT I BUILD
            </span>
            <span className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-serif italic font-normal text-[#141416] lowercase leading-none">
              with.
            </span>
          </h2>
        </div>

        {/* 3. Two-Column Editorial Layout with Kinetic Typography Reveals */}
        <div ref={rowsRef} className="space-y-10 sm:space-y-12 md:space-y-14">
          {techStackGroups.map((group, groupIdx) => (
            <div
              key={groupIdx}
              className="tech-stack-row grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 md:gap-10 items-start"
            >
              {/* LEFT COLUMN: Narrow column with category label appearing first */}
              <div className="md:col-span-3 lg:col-span-3 pt-1 sm:pt-1.5">
                <span className="category-label font-mono text-[10px] sm:text-[11px] text-[#9ca3af] tracking-[0.2em] uppercase font-semibold block">
                  {group.category}
                </span>
              </div>

              {/* RIGHT COLUMN: Wider column with kinetic emerging technology words */}
              <div className="md:col-span-9 lg:col-span-9 space-y-1.5 sm:space-y-2 font-condensed font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[46px] xl:text-[50px] tracking-tight text-[#141416] leading-[1.12] sm:leading-[1.15]">
                {group.lines.map((line, lineIdx) => (
                  <div key={lineIdx} className="relative">
                    {/* Faint sublabel above primary language line (Frame 0.00s above PYTHON) */}
                    {lineIdx === 0 && group.sublabel && (
                      <span className="category-sublabel block font-mono text-[9px] sm:text-[10px] text-[#a8a29e] tracking-[0.2em] uppercase mb-0.5">
                        {group.sublabel}
                      </span>
                    )}

                    <div className="flex flex-wrap items-baseline gap-x-3 sm:gap-x-4">
                      {/* Highlighted Technology: Wrapped with clipping mask for smooth kinetic reveal and magnifying hover */}
                      {line.highlight && (
                        <span className="kinetic-mask inline-block overflow-hidden align-baseline pb-1">
                          <span className="kinetic-word inline-block">
                            <span
                              data-tech={line.highlight}
                              data-is-highlight="true"
                              className="tech-magnify-item relative inline-block bg-[#e2ee5a] text-[#0a0a0c] px-2.5 sm:px-3.5 py-0.5 font-extrabold leading-tight mr-1 sm:mr-2 rounded-none shadow-none cursor-pointer select-none origin-center"
                            >
                              <span className="tech-glow pointer-events-none absolute -inset-1 rounded bg-[#e2ee5a]/75 blur-md opacity-0 -z-10" />
                              <span className="tech-label relative z-10">{line.highlight}</span>
                            </span>
                          </span>
                        </span>
                      )}

                      {/* Individual Technology Words with sequential staggered reveal and magnifying hover */}
                      {line.items.map((item, itemIdx) => (
                        <span
                          key={itemIdx}
                          className="kinetic-mask inline-block overflow-hidden align-baseline pb-1"
                        >
                          <span className="kinetic-word inline-block">
                            <span
                              data-tech={item}
                              className="tech-magnify-item relative inline-block text-[#141416] px-1.5 py-0.5 cursor-pointer select-none origin-center"
                            >
                              <span className="tech-glow pointer-events-none absolute -inset-1 rounded bg-[#e2ee5a]/50 blur-md opacity-0 -z-10" />
                              <span className="tech-label relative z-10">{item}</span>
                            </span>
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Full-Width Yellow Transition Curtain (Exact match from reference video step_03_0.60s.jpg) */}
      <div
        ref={yellowCurtainRef}
        className="w-full h-24 sm:h-36 md:h-44 bg-[#e2ee5a] origin-bottom border-t border-black/10 flex items-center justify-between px-6 sm:px-12 mt-16 sm:mt-24 select-none"
      >
        <div className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#0a0a0c]/70 font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-[#0a0a0c] inline-block" />
          <span>CHAPTER 04 // CERTIFICATIONS</span>
        </div>
        <div className="font-serif italic text-[#0a0a0c]/50 text-xs sm:text-sm hidden sm:block">
          verified industry accreditations &amp; credentials
        </div>
      </div>
    </section>
  );
}
