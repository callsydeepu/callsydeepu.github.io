import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile as defaultProfile } from "../data";
import { usePortfolioData } from "../context/PortfolioContext";

gsap.registerPlugin(ScrollTrigger);

export function ChapterSubject() {
  const { bio } = usePortfolioData();
  const profile = { ...defaultProfile, ...bio };

  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // Smooth reveal for the section headline
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

      // Smooth reveal for the portrait with subtle scale
      gsap.fromTo(
        portraitRef.current,
        { opacity: 0, scale: 0.94, y: 45 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: portraitRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Subtle scroll parallax for the yellow portrait card
      if (!prefersReducedMotion && portraitRef.current && sectionRef.current) {
        gsap.to(portraitRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      }

      // Staggered reveal for the editorial content on the right
      const textElements = contentRef.current?.querySelectorAll(".stagger-about");
      if (textElements && textElements.length > 0) {
        gsap.fromTo(
          textElements,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const details = [
    {
      label: "DEGREE",
      value: "B.Tech, Computer Science & Engineering (Artificial Intelligence)"
    },
    {
      label: "CAMPUS",
      value: "Parul University, Vadodara"
    },
    {
      label: "TIMELINE",
      value: "Sept 2023 — May 2027"
    },
    {
      label: "CGPA",
      value: "8.79 / 10.0"
    },
    {
      label: "POSITIONING",
      value: "AI Engineer & Full-Stack Developer"
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="about-subject"
      className="py-20 sm:py-28 md:py-32 bg-[#f5f4ef] text-[#141416] border-b border-[#dedad0] select-none"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Chapter 01 Identifier */}
        <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-[#737066] uppercase mb-4">
          <span className="w-2.5 h-2.5 bg-[#141416] inline-block" />
          <span>CH. 01 — THE SUBJECT</span>
        </div>

        {/* Master Heading (Matching reference video: "STUDYING HOW MACHINES LEARN. Building the systems they run on.") */}
        <div ref={headlineRef} className="max-w-5xl mb-14 sm:mb-20">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-display font-extrabold text-[#141416] tracking-tight leading-[0.94] uppercase">
            {profile.manifestoLead}
          </h2>
          <div className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-serif italic font-normal text-[#2e2d29] mt-2 leading-[1.02]">
            {profile.manifestoSub}
          </div>
        </div>

        {/* Two-Column Editorial Layout (Exactly matching the new reference screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 lg:gap-16 items-start">
          {/* LEFT SIDE: Large Rectangular Portrait with Bright Yellow Background */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div
              ref={portraitRef}
              className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[3/4] bg-[#e2ee5a] overflow-hidden shadow-2xl border border-black/10"
            >
              {/* Graphic background yellow block with contrast portrait */}
              <picture>
                <source srcSet={profile.portrait} type="image/webp" />
                <img
                  src={profile.portraitJpg}
                  alt="Sai Deepak Ambati"
                  className="w-full h-full object-cover object-top filter grayscale contrast-115 mix-blend-multiply opacity-95 hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                />
              </picture>

              {/* Editorial corner stamp */}
              <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#141416] text-[#e2ee5a] font-mono text-[10px] tracking-widest uppercase z-10">
                SD
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Personal Introduction and Profile Information */}
          <div ref={contentRef} className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* Lead Heading / Introduction with Yellow Highlighter Stroke */}
            <h3 className="stagger-about text-2xl sm:text-3xl lg:text-[34px] font-serif font-normal text-[#141416] leading-[1.25]">
              I’m {profile.displayName} — a B.Tech student in{" "}
              <span className="relative inline-block whitespace-normal">
                <span className="relative z-10 font-medium">
                  Artificial Intelligence and Machine Learning
                </span>
                <span
                  className="absolute bottom-1 inset-x-0 h-3 bg-[#e2ee5a] -z-0 opacity-80"
                  aria-hidden="true"
                />
              </span>{" "}
              at Parul University, Vadodara, holding a CGPA {profile.cgpa}.
            </h3>

            {/* Paragraph 1: Tech Focus & Full-Stack Capabilities */}
            <p className="stagger-about text-sm sm:text-base text-[#47453f] font-sans leading-relaxed">
              Python is my primary language; LangChain, LangGraph, FastAPI, Redis, and Qdrant are where most of my projects live. Building full-stack systems taught me to carry an idea from the interface, through the server, into the database, and out to production deployment.
            </p>

            {/* Paragraph 2: Philosophy & What Pulls Me Forward */}
            <p className="stagger-about text-sm sm:text-base text-[#47453f] font-sans leading-relaxed">
              What pulls me forward is system design, autonomous multi-agent orchestration, and scalable RAG — the places where careful engineering and intelligent software meet. Competitive programming keeps the algorithmic fundamentals sharp.
            </p>

            {/* Profile Details in Clean Label/Value Layout with Subtle Horizontal Dividers */}
            <div className="stagger-about pt-4 space-y-0">
              {details.map((item, index) => (
                <div
                  key={index}
                  className="py-3.5 border-t border-[#dedad0] grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 items-baseline"
                >
                  {/* Label in narrow left sub-column */}
                  <span className="sm:col-span-4 font-mono text-[11px] sm:text-xs text-[#737066] uppercase tracking-wider font-semibold">
                    {item.label}
                  </span>
                  {/* Value in right sub-column */}
                  <span className="sm:col-span-8 font-mono text-xs sm:text-sm text-[#141416] font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
              <div className="border-t border-[#dedad0]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
