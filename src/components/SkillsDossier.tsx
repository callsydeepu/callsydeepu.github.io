import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, Terminal, CheckCircle2, ShieldCheck, ArrowUpRight, Cpu } from "lucide-react";
import { skillGroups, certifications } from "../data";

gsap.registerPlugin(ScrollTrigger);

export function SkillsDossier() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%"
          }
        }
      );

      const groups = sectionRef.current?.querySelectorAll(".skill-group-card");
      groups?.forEach((grp) => {
        gsap.fromTo(
          grp,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: grp,
              start: "top 85%"
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="py-28 sm:py-36 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Editorial Header */}
        <div ref={titleRef} className="mb-16">
          <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-accent-yellow uppercase mb-3">
            <span className="w-6 h-[1px] bg-accent-yellow" />
            <span>CHAPTER 03 // TECHNICAL SPECIFICATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.1]">
            Engineering toolkit & <span className="text-accent-yellow">verified</span> credentials.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-ivory-400 font-serif italic max-w-2xl">
            "Organized across AI pipelines, high-throughput backend services, vector storage, and systems infrastructure."
          </p>
        </div>

        {/* 6 Meaningful Engineering Skill Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {skillGroups.map((group, idx) => (
            <div
              key={group.category}
              className="skill-group-card p-6 rounded-xl bg-ink-850/70 border border-white/10 flex flex-col justify-between hover:border-accent-yellow/40 transition-colors duration-300"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-[10px] font-mono text-accent-yellow tracking-wider">
                    [0{idx + 1}] // {group.badge}
                  </span>
                  <Terminal size={14} className="text-ivory-400" />
                </div>

                <h3 className="text-lg font-display font-bold text-white mt-4 mb-2">
                  {group.category}
                </h3>
                <p className="text-xs text-ivory-400 font-sans mb-5 leading-relaxed">
                  {group.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill.name}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                        skill.highlight
                          ? "bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30 font-medium"
                          : "bg-white/5 text-ivory-300 border border-white/5 hover:border-white/20"
                      }`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-6 flex items-center justify-between text-[10px] font-mono text-ivory-400/60">
                <span>VERIFIED PROFICIENCY</span>
                <span>PRODUCTION READY</span>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications & Formal Training Dossier */}
        <div className="rounded-2xl bg-gradient-to-r from-ink-900 via-ink-850 to-ink-900 border border-white/15 p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-accent-yellow mb-1">
                <Award size={16} />
                <span>FORMAL CERTIFICATIONS & TRAINING</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-white">
                Industry Certifications & Specialized Training
              </h3>
            </div>
            <span className="text-xs font-mono text-ivory-400 px-3 py-1 rounded bg-white/5 border border-white/10 w-fit">
              5 VERIFIED CREDENTIALS
            </span>
          </div>

          <div className="divide-y divide-white/10 mt-4">
            {certifications.map((cert, i) => (
              <div
                key={cert.title}
                className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono group hover:bg-white/[0.02] px-2 rounded-lg transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="text-accent-yellow font-bold text-[11px] mt-0.5 sm:mt-0">
                    [0{i + 1}]
                  </span>
                  <div>
                    <span className="text-white font-medium text-sm group-hover:text-accent-yellow transition-colors block">
                      {cert.title}
                    </span>
                    <span className="text-ivory-400 text-xs mt-0.5 block sm:hidden">
                      {cert.issuer} • {cert.year}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-6 text-ivory-300">
                  <span className="text-ivory-400">{cert.issuer}</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-accent-yellow border border-accent-yellow/20">
                    {cert.year}
                  </span>
                  <ShieldCheck size={16} className="text-accent-yellow" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

