import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Calendar, Sparkles, GraduationCap, School, BookOpen } from "lucide-react";
import { educationTimeline, EducationStage } from "../data";

gsap.registerPlugin(ScrollTrigger);

export function ChapterJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Master Headline entrance
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // 2. Continuous Vertical Timeline Line Drawing with Scroll Scrub
      if (timelineLineRef.current && timelineContainerRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: timelineContainerRef.current,
              start: "top 78%",
              end: "bottom 82%",
              scrub: 0.6
            }
          }
        );
      }

      // 3. Staggered Entrance for Timeline Milestones
      const milestones = gsap.utils.toArray<HTMLElement>(".timeline-milestone-item");
      milestones.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // 4. Subtle Reveal for Percentage Badges
      const percentageBadges = gsap.utils.toArray<HTMLElement>(".journey-percentage");
      percentageBadges.forEach((badge) => {
        gsap.fromTo(
          badge,
          { opacity: 0, scale: 0.88, x: 15 },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.7,
            delay: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: badge,
              start: "top 88%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // 5. Subtle Background Outlined Typography Parallax
      const watermarks = gsap.utils.toArray<HTMLElement>(".journey-watermark");
      watermarks.forEach((wm) => {
        gsap.to(wm, {
          yPercent: -15,
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
  }, []);

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative py-24 sm:py-32 md:py-36 bg-[#0a0a0c] text-ivory-100 select-none overflow-hidden border-b border-white/10"
    >
      {/* Anchor alias for backwards compatibility */}
      <span id="record" className="sr-only" aria-hidden="true" />
      {/* Background Watermark Initials / Typography */}
      <div className="absolute right-[-2%] top-[12%] pointer-events-none select-none z-0 overflow-hidden opacity-10">
        <span className="journey-watermark block font-condensed font-extrabold text-[32vw] leading-none text-transparent tracking-tighter outlined-stencil">
          ACADEMIA
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Chapter 05 Badge */}
        <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-[#e2ee5a] uppercase mb-4">
          <span className="w-2.5 h-2.5 bg-[#e2ee5a] inline-block shadow-[0_0_10px_#e2ee5a]" />
          <span className="font-bold">CH. 05 — MY JOURNEY</span>
          <span className="text-white/20 font-mono text-xs">//</span>
          <span className="text-ivory-400">EDUCATION TIMELINE</span>
        </div>

        {/* Master Headline: "THE JOURNEY. so far." */}
        <div ref={headlineRef} className="mb-16 sm:mb-20 md:mb-24 max-w-4xl">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-condensed font-extrabold text-white tracking-tight uppercase leading-[0.92]">
            THE JOURNEY
          </h2>
          <div className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-serif italic font-normal text-[#e2ee5a] mt-1 leading-[1.05]">
            so far.
          </div>
          <p className="mt-5 text-sm sm:text-base text-ivory-300 font-sans leading-relaxed max-w-2xl">
            A documented progression of academic foundations, foundational engineering, and core specialization in artificial intelligence and systems architecture.
          </p>
        </div>

        {/* Continuous Timeline Vertical Layout */}
        <div ref={timelineContainerRef} className="relative max-w-4xl mx-auto pl-2 sm:pl-4">
          {/* Continuous Vertical Timeline Line */}
          <div
            ref={timelineLineRef}
            className="absolute left-[20px] sm:left-[24px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#e2ee5a] via-white/25 to-white/10 pointer-events-none z-0"
          />

          <div className="space-y-12 sm:space-y-16">
            {educationTimeline.map((item: EducationStage) => {
              const isCurrent = item.isCurrent;

              return (
                <div
                  key={item.id}
                  className="timeline-milestone-item relative flex items-start gap-5 sm:gap-8 group"
                >
                  {/* Numbered Milestone Node Indicator */}
                  <div className="relative z-10 shrink-0">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-mono font-extrabold text-xs sm:text-sm flex items-center justify-center transition-all duration-300 ${
                        isCurrent
                          ? "bg-[#e2ee5a] text-[#0a0a0c] shadow-[0_0_25px_rgba(226,238,90,0.5)] ring-4 ring-[#e2ee5a]/25 scale-105"
                          : "bg-[#141416] border border-white/25 text-ivory-300 group-hover:border-[#e2ee5a]/60 group-hover:text-white"
                      }`}
                    >
                      {item.number}
                    </div>

                    {/* Glowing Beacon Pulse on Current Milestone */}
                    {isCurrent && (
                      <span className="absolute -inset-1 rounded-full bg-[#e2ee5a]/30 animate-ping pointer-events-none" />
                    )}
                  </div>

                  {/* Milestone Card Content */}
                  <div
                    className={`flex-1 rounded-none p-6 sm:p-8 md:p-10 transition-all duration-300 border ${
                      isCurrent
                        ? "bg-gradient-to-br from-[#e2ee5a]/[0.06] via-[#141418] to-[#0a0a0c] border-[#e2ee5a]/40 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
                        : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.03]"
                    }`}
                  >
                    {/* Top Row: Stage Metadata & Current Status Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase font-bold text-[#e2ee5a]">
                          {item.level}
                        </span>
                        {item.period && (
                          <>
                            <span className="text-white/20 font-mono text-xs">//</span>
                            <span className="text-xs font-mono text-ivory-400 flex items-center gap-1.5">
                              <Calendar size={12} className="text-[#e2ee5a]" />
                              <span>{item.period}</span>
                            </span>
                          </>
                        )}
                      </div>

                      {/* Highlighted Status Tag for B.Tech */}
                      {item.status && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e2ee5a] text-[#0a0a0c] font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(226,238,90,0.35)] select-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0c] animate-pulse" />
                          <span>{item.status}</span>
                        </div>
                      )}
                    </div>

                    {/* Stage Title in Large Condensed Typography & Percentage Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-condensed font-extrabold text-white tracking-tight uppercase leading-[1.05]">
                        {item.degreeTitle}
                      </h3>

                      {item.percentage && (
                        <div className="journey-percentage shrink-0 inline-flex items-baseline gap-2 px-3.5 py-1.5 bg-[#e2ee5a]/10 border border-[#e2ee5a]/40 self-start sm:self-auto shadow-[0_0_20px_rgba(226,238,90,0.12)] group-hover:border-[#e2ee5a] group-hover:shadow-[0_0_25px_rgba(226,238,90,0.25)] transition-all duration-300">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-[#e2ee5a]/80 font-bold">
                            PERCENTAGE
                          </span>
                          <span className="font-condensed font-extrabold text-2xl sm:text-3xl text-[#e2ee5a] leading-none tracking-tight">
                            {item.percentage}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Institution & Location */}
                    <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-2 text-ivory-200 font-sans font-medium text-base sm:text-lg">
                        {isCurrent ? (
                          <GraduationCap size={18} className="text-[#e2ee5a] shrink-0" />
                        ) : (
                          <School size={18} className="text-ivory-400 shrink-0" />
                        )}
                        <span>{item.institution}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-mono text-ivory-400">
                        <MapPin size={13} className="text-[#e2ee5a]" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    {/* B.Tech Focus Areas Tags */}
                    {item.focusAreas && item.focusAreas.length > 0 && (
                      <div className="mt-6 pt-5 border-t border-white/10">
                        <div className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-ivory-400 font-semibold mb-3 flex items-center gap-2">
                          <BookOpen size={12} className="text-[#e2ee5a]" />
                          <span>FOCUS AREAS &amp; CORE COMPETENCIES</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.focusAreas.map((focus, fIdx) => (
                            <span
                              key={fIdx}
                              className="px-3 py-1.5 bg-white/5 border border-white/10 hover:border-[#e2ee5a]/40 text-ivory-200 hover:text-white font-mono text-xs tracking-wide transition-colors"
                            >
                              {focus}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section Chapter Lead to Hire Me */}
        <div className="mt-20 sm:mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-ivory-400/60">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#e2ee5a]" />
            <span>05 // ACADEMIC FOUNDATIONS VERIFIED</span>
          </div>
          <a
            href="#hire-me"
            className="hover:text-[#e2ee5a] transition-colors flex items-center gap-1 text-ivory-300"
          >
            <span>NEXT: PULL ME INTO YOUR TEAM (CH. 06)</span>
            <span className="text-[#e2ee5a]">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// Re-export with legacy alias to ensure backwards compatibility
export { ChapterJourney as ChapterRecord };
