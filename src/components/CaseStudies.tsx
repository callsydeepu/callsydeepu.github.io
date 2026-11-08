import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  Github,
  ArrowUpRight,
  BrainCircuit,
  Database,
  Server,
  Layers,
  Sparkles,
  Search,
  BookOpen,
  PenTool,
  CheckCircle,
  FileCheck,
  Cpu,
  Mail,
  Zap,
  Clock,
  ShieldAlert
} from "lucide-react";
import { projects } from "../data";

gsap.registerPlugin(ScrollTrigger);

export function CaseStudies() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
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

      // Animate each case study as it enters viewport
      const cards = containerRef.current?.querySelectorAll(".case-study-entry");
      cards?.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 78%"
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="projects" className="py-28 sm:py-36 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Editorial Chapter Header */}
        <div ref={titleRef} className="mb-20">
          <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-accent-yellow uppercase mb-3">
            <span className="w-6 h-[1px] bg-accent-yellow" />
            <span>CHAPTER 02 // FIELD CASE STUDIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.05]">
            Architecting <span className="text-accent-yellow">agentic</span> systems.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-ivory-400 font-serif italic max-w-2xl">
            "A documentary examination of multi-agent orchestration, local document intelligence, and fault-tolerant distributed infrastructure."
          </p>
        </div>

        {/* Case Studies Sequence */}
        <div className="space-y-24">
          {/* CASE STUDY 01: AGENTSPACE (Heroic Feature) */}
          <article className="case-study-entry rounded-2xl bg-gradient-to-b from-ink-850 to-ink-900 border border-white/15 overflow-hidden shadow-2xl">
            {/* Editorial Top Ribbon */}
            <div className="px-6 sm:px-8 py-4 bg-ink-950/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded bg-accent-yellow/20 text-accent-yellow font-mono text-xs font-bold border border-accent-yellow/30">
                  CASE NO. 01
                </span>
                <span className="text-xs font-mono text-ivory-300 tracking-wider">
                  MULTI-AGENT ORCHESTRATION PLATFORM
                </span>
              </div>
              <div className="text-xs font-mono text-ivory-400/80 flex items-center gap-3">
                <span>TIMEFRAME: JUNE 2026 — PRESENT</span>
                <span className="hidden sm:inline">•</span>
                <span className="text-accent-yellow hidden sm:inline">MERN + LANGGRAPH + QDRANT</span>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Narrative & Problem/Solution (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                    AgentSpace
                  </h3>
                  <div className="text-sm font-mono text-accent-yellow mt-1">
                    Distributed Multi-Agent AI Platform & Microservices Orchestration
                  </div>
                </div>

                <p className="text-sm sm:text-base text-ivory-300 font-sans leading-relaxed">
                  Designed a full-stack multi-agent AI platform on the MERN stack with microservices architecture, enabling simultaneous orchestration of <strong className="text-white">8 concurrent AI agent workflows</strong> across search, research, coding, and document analysis.
                </p>

                {/* Challenge & Solution Editorial Blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-ink-950/70 border border-white/5 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono text-accent-red">
                      <ShieldAlert size={14} />
                      <span className="uppercase font-bold">The Challenge</span>
                    </div>
                    <p className="text-xs text-ivory-300/80 leading-relaxed font-sans">
                      Monolithic LLM chains hit token limits and suffer catastrophic hallucination when performing compound analytical tasks across large document corpora.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-ink-950/70 border border-white/5 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono text-accent-yellow">
                      <Zap size={14} />
                      <span className="uppercase font-bold">The Engineering Solution</span>
                    </div>
                    <p className="text-xs text-ivory-300/80 leading-relaxed font-sans">
                      Constructed an event-driven LangGraph orchestrator delegating sub-tasks with Qdrant vector memory and Redis state caching to cut redundant latency.
                    </p>
                  </div>
                </div>

                {/* Verified Impact Bullets */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-mono tracking-wider text-ivory-400 uppercase block">
                    VERIFIED TECHNICAL ACHIEVEMENTS:
                  </span>
                  <ul className="space-y-2 text-xs text-ivory-200 font-mono">
                    <li className="flex items-start gap-2.5">
                      <span className="text-accent-yellow mt-0.5">▹</span>
                      <span>Orchestrated 8 concurrent AI agent workflows with automated rate-limit recovery.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-accent-yellow mt-0.5">▹</span>
                      <span>Built RAG-based document intelligence pipeline indexing 100+ documents with context-aware responses.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-accent-yellow mt-0.5">▹</span>
                      <span>Executed secure REST APIs with JWT authentication, file upload pipelines, and Redis caching reducing average latency by 40%.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-accent-yellow mt-0.5">▹</span>
                      <span>Production Docker containerization & AWS deployment adhering to scalable engineering practices.</span>
                    </li>
                  </ul>
                </div>

                {/* Tech Stack Tags */}
                <div className="pt-2">
                  <div className="flex flex-wrap gap-2">
                    {["Node.js", "Express.js", "MongoDB", "LangChain", "LangGraph", "Qdrant", "Redis", "Docker", "AWS"].map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-ivory-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                  <a
                    href="https://www.github.com/callsydeepu/agentspace"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-yellow text-ink-950 font-mono text-xs font-bold hover:bg-accent-yellowLight transition-colors shadow-glow"
                  >
                    <Github size={15} />
                    <span>EXPLORE REPOSITORY</span>
                    <ArrowUpRight size={14} />
                  </a>
                  <span className="text-xs font-mono text-ivory-400">
                    STATUS: ACTIVE REPO
                  </span>
                </div>
              </div>

              {/* Right Column: Architectural Telemetry Visualizer (5 cols) */}
              <div className="lg:col-span-5 p-6 rounded-xl bg-ink-950 border border-white/10 font-mono space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                  <span className="text-accent-yellow flex items-center gap-2">
                    <BrainCircuit size={15} />
                    <span>ORCHESTRATOR MATRIX</span>
                  </span>
                  <span className="text-ivory-400 text-[10px]">8 NODES RUNNING</span>
                </div>

                {/* Interactive Agent Cluster Visualizer */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-ink-900 border border-accent-yellow/30 flex flex-col justify-between">
                    <span className="text-[10px] text-accent-yellow">CORE ROUTER</span>
                    <span className="font-bold text-white mt-1">Intent Classifier</span>
                    <span className="text-[9px] text-ivory-400 mt-2">LangGraph state</span>
                  </div>

                  <div className="p-3 rounded-lg bg-ink-900 border border-white/10 flex flex-col justify-between">
                    <span className="text-[10px] text-accent-blue">VECTOR STORE</span>
                    <span className="font-bold text-white mt-1">Qdrant Cluster</span>
                    <span className="text-[9px] text-ivory-400 mt-2">Cosine 1536-dim</span>
                  </div>

                  <div className="p-3 rounded-lg bg-ink-900 border border-white/10 flex flex-col justify-between">
                    <span className="text-[10px] text-accent-emerald">MEMORY CACHE</span>
                    <span className="font-bold text-white mt-1">Redis In-Memory</span>
                    <span className="text-[9px] text-ivory-400 mt-2">-40% Query Latency</span>
                  </div>

                  <div className="p-3 rounded-lg bg-ink-900 border border-accent-red/30 flex flex-col justify-between">
                    <span className="text-[10px] text-accent-red">CONTAINER</span>
                    <span className="font-bold text-white mt-1">Docker & AWS</span>
                    <span className="text-[9px] text-ivory-400 mt-2">Microservices</span>
                  </div>
                </div>

                {/* Real Terminal Stream Simulation */}
                <div className="p-3.5 rounded-lg bg-black/80 border border-white/10 text-[10px] space-y-1.5 text-ivory-300">
                  <div className="text-accent-yellow flex items-center justify-between">
                    <span>$ agent-ctl --status</span>
                    <span className="text-[8px] bg-accent-yellow/20 px-1 rounded">HEALTHY</span>
                  </div>
                  <div className="text-ivory-400">[00:01.04] Agent 'researcher' dispatched via Tavily</div>
                  <div className="text-ivory-400">[00:01.48] Agent 'critic' validated schema: PASS (0.94)</div>
                  <div className="text-accent-emerald">[00:01.89] Redis cache updated: key=agentspace:session:08</div>
                </div>
              </div>
            </div>
          </article>

          {/* CASE STUDY 02: RESEARCHMIND (Multi-Agent Research Pipeline) */}
          <article className="case-study-entry rounded-2xl bg-gradient-to-b from-ink-850 to-ink-900 border border-white/15 overflow-hidden shadow-2xl">
            <div className="px-6 sm:px-8 py-4 bg-ink-950/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded bg-accent-red/20 text-accent-red font-mono text-xs font-bold border border-accent-red/30">
                  CASE NO. 02
                </span>
                <span className="text-xs font-mono text-ivory-300 tracking-wider">
                  AUTONOMOUS MULTI-AGENT RESEARCH SYSTEM
                </span>
              </div>
              <div className="text-xs font-mono text-ivory-400/80">
                <span>TIMEFRAME: JAN 2026 — JUNE 2026</span>
              </div>
            </div>

            <div className="p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Narrative (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                    ResearchMind
                  </h3>
                  <div className="text-sm font-mono text-accent-red mt-1">
                    4-Agent Research Pipeline with Iterative Critique Loops
                  </div>
                </div>

                <p className="text-sm sm:text-base text-ivory-300 font-sans leading-relaxed">
                  Architected a 4-agent AI research pipeline in Python using LangChain and LangGraph. The system coordinates <strong className="text-white">Search, Reader, Writer, and Critic</strong> agents with sequential workflows, automatic retries, and rate-limit handling to generate structured Markdown intelligence reports.
                </p>

                {/* 4-Agent Pipeline Workflow Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-ink-950 border border-white/5">
                    <Search size={18} className="text-accent-yellow mx-auto mb-1.5" />
                    <span className="text-xs font-mono font-bold text-white block">SEARCH</span>
                    <span className="text-[9px] font-mono text-ivory-400">Tavily Engine</span>
                  </div>
                  <div className="p-3 rounded-lg bg-ink-950 border border-white/5">
                    <BookOpen size={18} className="text-accent-blue mx-auto mb-1.5" />
                    <span className="text-xs font-mono font-bold text-white block">READER</span>
                    <span className="text-[9px] font-mono text-ivory-400">BeautifulSoup</span>
                  </div>
                  <div className="p-3 rounded-lg bg-ink-950 border border-white/5">
                    <PenTool size={18} className="text-accent-emerald mx-auto mb-1.5" />
                    <span className="text-xs font-mono font-bold text-white block">WRITER</span>
                    <span className="text-[9px] font-mono text-ivory-400">LCEL Synthesis</span>
                  </div>
                  <div className="p-3 rounded-lg bg-ink-950 border border-accent-red/30">
                    <FileCheck size={18} className="text-accent-red mx-auto mb-1.5" />
                    <span className="text-xs font-mono font-bold text-accent-red block">CRITIC</span>
                    <span className="text-[9px] font-mono text-ivory-400">Quality Scoring</span>
                  </div>
                </div>

                {/* Verified Achievements */}
                <ul className="space-y-2 text-xs text-ivory-200 font-mono pt-2">
                  <li className="flex items-start gap-2.5">
                    <span className="text-accent-red mt-0.5">▹</span>
                    <span>Engineered an AI-powered research pipeline integrating Tavily and BeautifulSoup for dynamic web discovery.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-accent-red mt-0.5">▹</span>
                    <span>LCEL-based workflows for structured Markdown generation, automated quality scoring, and iterative revision feedback.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-accent-red mt-0.5">▹</span>
                    <span>Real-time Streamlit dashboard featuring live multi-agent status tracking and session research history.</span>
                  </li>
                </ul>

                <div className="flex flex-wrap gap-2 pt-2">
                  {["Python", "LangChain", "LangGraph", "LLMs", "Streamlit", "Tavily", "BeautifulSoup"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-ivory-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                  <a
                    href="https://www.github.com/callsydeepu/researchmind"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-red text-white font-mono text-xs font-bold hover:bg-red-600 transition-colors"
                  >
                    <Github size={15} />
                    <span>EXPLORE RESEARCHMIND REPO</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>

              {/* Right Column: Live Streamlit Dossier Preview (5 cols) */}
              <div className="lg:col-span-5 p-6 rounded-xl bg-ink-950 border border-white/10 font-mono space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                  <span className="text-accent-red flex items-center gap-2">
                    <Sparkles size={15} />
                    <span>STREAMLIT TELEMETRY</span>
                  </span>
                  <span className="text-ivory-400 text-[10px]">LIVE DASHBOARD</span>
                </div>

                <div className="p-4 rounded-lg bg-ink-900 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ivory-300 font-bold">Research Topic:</span>
                    <span className="text-accent-yellow">Multi-Agent Systems</span>
                  </div>
                  <div className="space-y-2 text-[10px] text-ivory-400">
                    <div className="flex items-center justify-between">
                      <span>Search Agent Status:</span>
                      <span className="text-accent-emerald">COMPLETE (8 URLs)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Reader Agent Status:</span>
                      <span className="text-accent-emerald">PARSED (34,000 words)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Critic Quality Score:</span>
                      <span className="text-accent-yellow font-bold">92 / 100 [APPROVED]</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-black/60 border border-white/5 text-[10px] text-ivory-300 space-y-1">
                  <div className="text-accent-yellow">Output: /reports/2026-multi-agent-survey.md</div>
                  <div className="text-ivory-400">Generated 14 cited sections with academic cross-references.</div>
                </div>
              </div>
            </div>
          </article>

          {/* TWO-COLUMN EDITORIAL GRID: CASE 03 (Cognitive RAG) & CASE 04 (Email Scheduler) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* CASE 03: COGNITIVE RAG */}
            <article className="case-study-entry rounded-2xl bg-gradient-to-b from-ink-850 to-ink-900 border border-white/15 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="px-2.5 py-0.5 rounded bg-accent-blue/20 text-accent-blue font-mono text-xs font-bold border border-accent-blue/30">
                    CASE NO. 03
                  </span>
                  <span className="text-xs font-mono text-ivory-400">
                    JUN 2025 — DEC 2025
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                    Cognitive RAG
                  </h3>
                  <div className="text-xs font-mono text-accent-blue mt-1">
                    Air-Gapped Document Intelligence & Local LLMs
                  </div>
                </div>

                <p className="text-sm text-ivory-300 font-sans leading-relaxed">
                  Built a Retrieval-Augmented Generation (RAG) engine that enables users to upload PDF documents and query them locally using Ollama inference, ensuring complete privacy with zero cloud exposure.
                </p>

                <div className="p-4 rounded-xl bg-ink-950 border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-accent-blue font-bold">
                    <Database size={14} />
                    <span>VECTOR INGESTION PIPELINE</span>
                  </div>
                  <p className="text-[11px] text-ivory-300/80 leading-relaxed font-sans">
                    End-to-end processing with PyPDFLoader, recursive text chunking, Nomic embeddings, and ChromaDB for high-fidelity cosine similarity semantic retrieval.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["FastAPI", "Python", "LangChain", "ChromaDB", "Ollama", "Nomic"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-ivory-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                <a
                  href="https://github.com/callsydeepu/Production-RAG-Engine"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-accent-blue hover:text-white transition-colors"
                >
                  <Github size={15} />
                  <span>VIEW REPOSITORY</span>
                  <ArrowUpRight size={13} />
                </a>
                <span className="text-[10px] font-mono text-ivory-400">FastAPI REST APIs</span>
              </div>
            </article>

            {/* CASE 04: SYSTEM ANOMALY DETECTION */}
            <article className="case-study-entry rounded-2xl bg-gradient-to-b from-ink-850 to-ink-900 border border-white/15 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="px-2.5 py-0.5 rounded bg-accent-emerald/20 text-accent-emerald font-mono text-xs font-bold border border-accent-emerald/30">
                    CASE NO. 04
                  </span>
                  <span className="text-xs font-mono text-ivory-400">
                    2026
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                    System Anomaly Detection
                  </h3>
                  <div className="text-xs font-mono text-accent-emerald mt-1">
                    Adaptive OS Anomaly Detection & ML Sentinel SOC
                  </div>
                </div>

                <p className="text-sm text-ivory-300 font-sans leading-relaxed">
                  A real-time machine-learning OS anomaly detection platform monitoring host telemetry, extracting 8 statistical behavioral features, and using an adaptive Isolation Forest model for zero-false-positive process intrusion alerts.
                </p>

                <div className="p-4 rounded-xl bg-ink-950 border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-accent-emerald font-bold">
                    <Server size={14} />
                    <span>ISOLATION FOREST SOC</span>
                  </div>
                  <p className="text-[11px] text-ivory-300/80 leading-relaxed font-sans">
                    Background telemetry collector observing normal workloads, generating personalized machine artifacts with zero personal data leakage.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["Python", "Isolation Forest", "Scikit-Learn", "psutil", "Streamlit", "Pandas"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-ivory-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                <a
                  href="https://github.com/callsydeepu/SystemAnomalyDetection"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-accent-emerald hover:text-white transition-colors"
                >
                  <Github size={15} />
                  <span>VIEW REPOSITORY</span>
                  <ArrowUpRight size={13} />
                </a>
                <span className="text-[10px] font-mono text-ivory-400">Streamlit SOC & ML Models</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

