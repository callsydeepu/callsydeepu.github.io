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

// User's verified skills directly from resume
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

      const isMobile = window.innerWidth < 768;
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

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
            start: "top 88%",
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
              duration: 0.35,
              ease: "power2.out"
            }
          );
        }

        // Step B: Staggered reveal for words
        if (words.length > 0) {
          tl.fromTo(
            words,
            {
              y: isMobile ? 18 : 30,
              opacity: 0
            },
            {
              y: 0,
              opacity: 1,
              duration: isMobile ? 0.45 : 0.65,
              stagger: isMobile ? 0.04 : 0.07,
              ease: "power3.out",
              onComplete: () => {
                masks.forEach((m) => {
                  m.style.overflow = "visible";
                });
              }
            },
            "-=0.15"
          );
        }
      });

      // 3. Magnifying Hover Effect on Desktop, Subtle Tap Feedback on Touch
      const techItems = rowsRef.current?.querySelectorAll<HTMLElement>(".tech-magnify-item");
      const cleanupFns: Array<() => void> = [];

      if (techItems) {
        techItems.forEach((el) => {
          const isHighlight = el.getAttribute("data-is-highlight") === "true";
          const glowEl = el.querySelector(".tech-glow");
          const labelEl = el.querySelector(".tech-label");

          // Reset initial transform
          gsap.set(el, { scale: 1, zIndex: 1, transformOrigin: "center center" });

          if (isTouchDevice) {
            // Touch device: Simple tap interaction without heavy mouse tracking
            let tapTimeout: any;

            const onTouchStart = () => {
              gsap.to(el, {
                scale: 1.1,
                zIndex: 20,
                duration: 0.2,
                ease: "power2.out",
                overwrite: "auto"
              });
              if (glowEl) {
                gsap.to(glowEl, { opacity: 0.8, duration: 0.2 });
              }
            };

            const onTouchEnd = () => {
              clearTimeout(tapTimeout);
              tapTimeout = setTimeout(() => {
                gsap.to(el, {
                  scale: 1,
                  zIndex: 1,
                  duration: 0.25,
                  ease: "power2.out",
                  overwrite: "auto"
                });
                if (glowEl) {
                  gsap.to(glowEl, { opacity: 0, duration: 0.25 });
                }
              }, 250);
            };

            el.addEventListener("touchstart", onTouchStart, { passive: true });
            el.addEventListener("touchend", onTouchEnd, { passive: true });

            cleanupFns.push(() => {
              clearTimeout(tapTimeout);
              el.removeEventListener("touchstart", onTouchStart);
              el.removeEventListener("touchend", onTouchEnd);
            });
          } else {
            // Desktop: Full GSAP magnifying hover interaction
            const setScale = gsap.quickTo(el, "scale", { duration: 0.35, ease: "power3.out" });

            const onEnter = () => {
              el.style.zIndex = "30";
              setScale(isHighlight ? 1.18 : 1.22);

              if (labelEl && !isHighlight) {
                gsap.to(labelEl, {
                  color: "#0a0a0c",
                  duration: 0.2,
                  ease: "power2.out",
                  overwrite: "auto"
                });
              }

              if (glowEl) {
                gsap.to(glowEl, {
                  opacity: 1,
                  duration: 0.25,
                  ease: "power2.out",
                  overwrite: "auto"
                });
              }
            };

            const onLeave = () => {
              setScale(1);

              gsap.to(el, {
                zIndex: 1,
                delay: 0.25,
                duration: 0,
                overwrite: false
              });

              if (labelEl && !isHighlight) {
                gsap.to(labelEl, {
                  color: "#141416",
                  duration: 0.25,
                  ease: "power2.out",
                  overwrite: "auto"
                });
              }

              if (glowEl) {
                gsap.to(glowEl, {
                  opacity: 0,
                  duration: 0.25,
                  ease: "power2.out",
                  overwrite: "auto"
                });
              }
            };

            el.addEventListener("pointerenter", onEnter);
            el.addEventListener("pointerleave", onLeave);

            cleanupFns.push(() => {
              el.removeEventListener("pointerenter", onEnter);
              el.removeEventListener("pointerleave", onLeave);
            });
          }
        });
      }

      // 4. Full-Width Yellow Transition Curtain
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
      className="pt-16 sm:pt-24 md:pt-32 pb-0 bg-[#f5f4ef] text-[#141416] select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* 1. Small Yellow / Black Section Badge */}
        <div
          ref={badgeRef}
          className="inline-block bg-[#e2ee5a] text-[#0a0a0c] px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider mb-3 sm:mb-4 rounded-none shadow-none"
        >
          CH. 03 — TOOLKIT
        </div>

        {/* 2. Main Heading: "WHAT I BUILD with." */}
        <div ref={headingRef} className="pb-6 sm:pb-8 border-b border-black/15 mb-10 sm:mb-14 md:mb-16">
          <h2 className="flex flex-row flex-wrap md:flex-nowrap items-baseline gap-2 sm:gap-4">
            <span className="text-3xl sm:text-5xl md:text-7xl lg:text-[76px] xl:text-[84px] font-condensed font-extrabold text-[#141416] tracking-tight uppercase leading-none">
              WHAT I BUILD
            </span>
            <span className="text-3xl sm:text-5xl md:text-7xl lg:text-[76px] xl:text-[84px] font-serif italic font-normal text-[#141416] lowercase leading-none">
              with.
            </span>
          </h2>
        </div>

        {/* 3. Two-Column Editorial Layout with Kinetic Typography Reveals */}
        <div ref={rowsRef} className="space-y-8 sm:space-y-12 md:space-y-14">
          {techStackGroups.map((group, groupIdx) => (
            <div
              key={groupIdx}
              className="tech-stack-row grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 md:gap-10 items-start"
            >
              {/* LEFT COLUMN: Category label appearing first */}
              <div className="md:col-span-3 lg:col-span-3 pt-0.5 sm:pt-1.5">
                <span className="category-label font-mono text-[10px] sm:text-[11px] text-[#78716c] tracking-[0.2em] uppercase font-bold block">
                  {group.category}
                </span>
              </div>

              {/* RIGHT COLUMN: Kinetic emerging technology words with responsive sizing */}
              <div className="md:col-span-9 lg:col-span-9 space-y-1.5 sm:space-y-2 font-condensed font-extrabold text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-[46px] xl:text-[50px] tracking-tight text-[#141416] leading-[1.15] sm:leading-[1.15]">
                {group.lines.map((line, lineIdx) => (
                  <div key={lineIdx} className="relative">
                    {/* Faint sublabel above primary language line */}
                    {lineIdx === 0 && group.sublabel && (
                      <span className="category-sublabel block font-mono text-[9px] sm:text-[10px] text-[#a8a29e] tracking-[0.2em] uppercase mb-0.5">
                        {group.sublabel}
                      </span>
                    )}

                    <div className="flex flex-wrap items-baseline gap-x-2 sm:gap-x-4 gap-y-1">
                      {/* Highlighted Technology: PYTHON */}
                      {line.highlight && (
                        <span className="kinetic-mask inline-block overflow-hidden align-baseline pb-1">
                          <span className="kinetic-word inline-block">
                            <span
                              data-tech={line.highlight}
                              data-is-highlight="true"
                              className="tech-magnify-item relative inline-block bg-[#e2ee5a] text-[#0a0a0c] px-2 sm:px-3.5 py-0.5 font-extrabold leading-tight mr-1 sm:mr-2 rounded-none shadow-none cursor-pointer select-none origin-center"
                            >
                              <span className="tech-glow pointer-events-none absolute -inset-1 rounded bg-[#e2ee5a]/75 blur-md opacity-0 -z-10" />
                              <span className="tech-label relative z-10">{line.highlight}</span>
                            </span>
                          </span>
                        </span>
                      )}

                      {/* Individual Technology Words */}
                      {line.items.map((item, itemIdx) => (
                        <span
                          key={itemIdx}
                          className="kinetic-mask inline-block overflow-hidden align-baseline pb-1"
                        >
                          <span className="kinetic-word inline-block">
                            <span
                              data-tech={item}
                              className="tech-magnify-item relative inline-block text-[#141416] px-1 sm:px-1.5 py-0.5 cursor-pointer select-none origin-center"
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

      {/* 4. Full-Width Yellow Transition Curtain */}
      <div
        ref={yellowCurtainRef}
        className="w-full h-12 sm:h-20 bg-[#e2ee5a] mt-16 sm:mt-24 pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
