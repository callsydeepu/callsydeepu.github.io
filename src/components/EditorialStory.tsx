import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Brain,
  Cpu,
  Layers,
  GraduationCap,
  Compass,
  GitBranch,
  Terminal,
  Activity,
  CheckCircle2,
  Lock
} from "lucide-react";
import { FlashlightReveal } from "./FlashlightReveal";
import { profile } from "../data";

gsap.registerPlugin(ScrollTrigger);

export function EditorialStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const essayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 80%"
          }
        }
      );

      gsap.fromTo(
        essayRef.current?.querySelectorAll(".story-block") || [],
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: essayRef.current,
            start: "top 75%"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Base layer of the Flashlight Inspection Module
  const baseBlueprint = (
    <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-ink-950 text-ivory-300">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-yellow/40" />
          <span className="text-[11px] font-mono tracking-widest text-ivory-400">
            SYSTEM ARCHITECTURE // APPLIED AGENTIC PIPELINE
          </span>
        </div>
        <span className="text-[10px] font-mono text-ivory-400/50">SCHEMATIC ID: SD-ENG-2026</span>
      </div>

      <div className="my-8 grid grid-cols-3 gap-3 sm:gap-4 text-center">
        <div className="p-4 rounded-lg bg-ink-900 border border-white/5 flex flex-col items-center">
          <Brain size={22} className="text-ivory-400 mb-2" />
          <span className="text-xs font-mono font-bold text-ivory-200">1. INPUT DISPATCH</span>
          <span className="text-[10px] text-ivory-400/60 mt-1">Multi-format payload routing</span>
        </div>
        <div className="p-4 rounded-lg bg-ink-900 border border-white/5 flex flex-col items-center">
          <Layers size={22} className="text-ivory-400 mb-2" />
          <span className="text-xs font-mono font-bold text-ivory-200">2. AGENT GRAPH</span>
          <span className="text-[10px] text-ivory-400/60 mt-1">Concurrent sub-agent consensus</span>
        </div>
        <div className="p-4 rounded-lg bg-ink-900 border border-white/5 flex flex-col items-center">
          <Cpu size={22} className="text-ivory-400 mb-2" />
          <span className="text-xs font-mono font-bold text-ivory-200">3. PERSISTENT STATE</span>
          <span className="text-[10px] text-ivory-400/60 mt-1">Vector DB & Redis memory cache</span>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4 flex items-center justify-between text-[10px] font-mono text-ivory-400/60">
        <span>INSPECTION STATUS: DARK BASELINE</span>
        <span>HOVER OR DRAG TORCHLIGHT TO REVEAL TELEMETRY</span>
      </div>
    </div>
  );

  // Hidden Reveal Layer illuminated under the torchlight
  const revealedBlueprint = (
    <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#111218] text-accent-yellow border border-accent-yellow/30">
      <div className="flex items-center justify-between border-b border-accent-yellow/30 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-yellow animate-ping" />
          <span className="text-[11px] font-mono tracking-widest text-accent-yellow font-bold">
            CONFIDENTIAL TELEMETRY // PRODUCTION METRICS UNLOCKED
          </span>
        </div>
        <span className="text-[10px] font-mono text-accent-yellow/80">REVEAL DEPTH: 100%</span>
      </div>

      {/* Secret Blueprint Details Revealed */}
      <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-lg bg-black/60 border border-accent-yellow/40 backdrop-blur-sm">
          <div className="text-[10px] font-mono text-accent-yellow/80 uppercase">ORCHESTRATION</div>
          <div className="text-lg font-display font-bold text-white mt-1">8 Concurrent Nodes</div>
          <div className="text-[10px] text-ivory-300 font-mono mt-2 leading-relaxed">
            LangGraph state machine coordinating search, reader, coder, and critic agents.
          </div>
        </div>

        <div className="p-4 rounded-lg bg-black/60 border border-accent-yellow/40 backdrop-blur-sm">
          <div className="text-[10px] font-mono text-accent-yellow/80 uppercase">LATENCY OPTIMIZATION</div>
          <div className="text-lg font-display font-bold text-accent-yellow mt-1">-40% Response Time</div>
          <div className="text-[10px] text-ivory-300 font-mono mt-2 leading-relaxed">
            Redis session caching & JWT pipeline bypassing redundant LLM invocations.
          </div>
        </div>

        <div className="p-4 rounded-lg bg-black/60 border border-accent-yellow/40 backdrop-blur-sm">
          <div className="text-[10px] font-mono text-accent-yellow/80 uppercase">PRIVACY AI</div>
          <div className="text-lg font-display font-bold text-white mt-1">Zero Telemetry Leak</div>
          <div className="text-[10px] text-ivory-300 font-mono mt-2 leading-relaxed">
            Ollama local inference + Nomic embeddings + ChromaDB vector storage.
          </div>
        </div>
      </div>

      {/* Technical annotation wireframe */}
      <div className="border-t border-accent-yellow/30 pt-4 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-accent-yellow">
        <span>[ACTIVE] PyPDFLoader → RecursiveChunker(chunk_size=1000, overlap=150)</span>
        <span className="text-white">QDRANT / CHROMA DUAL INDEXING</span>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} id="about" className="py-28 sm:py-36 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Editorial Chapter Heading */}
        <div ref={headlineRef} className="mb-16">
          <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-accent-yellow uppercase mb-3">
            <span className="w-6 h-[1px] bg-accent-yellow" />
            <span>CHAPTER 01 // INVESTIGATIVE DOSSIER</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.1]">
            Intelligence as an <span className="text-accent-yellow">engineered</span> discipline.
          </h2>
          <p className="mt-4 text-base text-ivory-400 font-serif italic max-w-2xl">
            "Large language models become transformative when combined with deterministic software boundaries, event-driven orchestrators, and persistent vector memory."
          </p>
        </div>

        {/* Two-Column Editorial Narrative & Interactive Flashlight Reveal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Essays & Background (6 cols) */}
          <div ref={essayRef} className="lg:col-span-6 space-y-8 font-sans">
            <div className="story-block p-6 rounded-xl bg-ink-850/60 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-accent-yellow">
                <Compass size={15} />
                <span>THE PERSPECTIVE</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white">
                Moving Beyond Monolithic Prompts
              </h3>
              <p className="text-sm text-ivory-300 leading-relaxed">
                {profile.summary}
              </p>
              <p className="text-sm text-ivory-300/80 leading-relaxed">
                Rather than treating generative models as monolithic black boxes, my work focuses on building multi-agent pipelines with LangChain and LangGraph. In systems like <strong className="text-white">AgentSpace</strong> and <strong className="text-white">ResearchMind</strong>, tasks are broken down into discrete responsibilities: search, reading, code generation, and critical validation.
              </p>
            </div>

            {/* Academic Credentials & Foundation */}
            <div className="story-block p-6 rounded-xl bg-ink-850/60 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-accent-yellow">
                <GraduationCap size={16} />
                <span>ACADEMIC FOUNDATION & DISTINCTION</span>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h4 className="text-lg font-display font-bold text-white">
                    {profile.education.degree}
                  </h4>
                  <div className="text-xs font-mono text-ivory-400 mt-1">
                    {profile.education.institution} • {profile.education.location}
                  </div>
                </div>
                <div className="px-3.5 py-1.5 rounded-lg bg-accent-yellow/10 border border-accent-yellow/30 text-accent-yellow text-xs font-mono font-bold">
                  CGPA: {profile.education.cgpa}
                </div>
              </div>
              <p className="text-xs font-mono text-ivory-400">
                Timeline: {profile.education.timeline} // Focus on Deep Learning, Vector Spaces, Distributed Systems, and Polyglot Engineering.
              </p>
            </div>

            {/* Core Engineering Working Principles */}
            <div className="story-block grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-ink-900 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-accent-yellow">
                  <CheckCircle2 size={14} />
                  <span>DETERMINISTIC GUARDRAILS</span>
                </div>
                <p className="text-xs text-ivory-300/80 leading-relaxed">
                  Schema enforcement using Pydantic, LCEL structured outputs, and strict retry loops before returning data to the caller.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-ink-900 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-accent-yellow">
                  <Activity size={14} />
                  <span>LATENCY SENSITIVITY</span>
                </div>
                <p className="text-xs text-ivory-300/80 leading-relaxed">
                  Deploying Redis caching, vector pre-filtering, and streaming endpoints in FastAPI and Node.js for rapid user feedback.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Flashlight Inspection Module (6 cols) */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-ivory-300">
                  <Terminal size={14} className="text-accent-yellow" />
                  <span>INTERACTIVE ARTIFACT // FLASHLIGHT INSPECTOR</span>
                </div>
                <span className="text-[10px] font-mono text-accent-yellow bg-accent-yellow/10 px-2.5 py-0.5 rounded border border-accent-yellow/20">
                  REAL-TIME BEAM
                </span>
              </div>

              {/* The Reusable FlashlightReveal Component */}
              <FlashlightReveal
                baseContent={baseBlueprint}
                revealContent={revealedBlueprint}
                beamRadius={230}
                className="h-[380px] sm:h-[420px] shadow-2xl"
                label="INSPECT AGENT ORCHESTRATION BLUEPRINT"
              />

              {/* Editorial Caption */}
              <div className="p-4 rounded-lg bg-ink-900 border border-white/5 flex items-start gap-3">
                <Lock size={15} className="text-accent-yellow shrink-0 mt-0.5" />
                <p className="text-xs text-ivory-400 font-mono leading-relaxed">
                  <strong className="text-ivory-200">Editorial Note:</strong> Move your pointer or drag on mobile across the architectural schematic above to illuminate the hidden metrics and orchestrator sub-nodes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

