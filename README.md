# Sai Deepak Ambati — AI Engineer & Full-Stack Developer Portfolio

[![Deploy to GitHub Pages](https://github.com/callsydeepu/callsydeepu.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/callsydeepu/callsydeepu.github.io/actions/workflows/deploy.yml)
[![Live Site](https://img.shields.io/badge/Live%20Demo-callsydeepu.github.io-e2ee5a?style=flat&logo=github&logoColor=black)](https://callsydeepu.github.io)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.16-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15.1-88CE02?style=flat&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

> **"Studying how machines learn. Building the systems they run on."**  
> A high-contrast, editorial, classified-dossier portfolio showcasing AI engineering, agentic systems, multimodal models, and distributed software engineering.

---

## 🌐 Live Deployment

Explore the live portfolio at: **[https://callsydeepu.github.io](https://callsydeepu.github.io)**

---

## 📖 Portfolio Architecture: The Six Chapters

The portfolio is structured as a six-part narrative dossier:

| Chapter | Code Identifier | Description |
|---|---|---|
| **Ch. 01** | `SUBJECT` | Dossier identification, positioning statement, interactive illumination & cursor-following spotlight, dynamic portrait composition, and direct CTAs. |
| **Ch. 02** | `CASE FILES` | Deep-dive case studies into 5 production-grade AI/ML projects featuring architectural metrics, tech stacks, and direct GitHub repository links. |
| **Ch. 03** | `TOOLKIT` | Interactive multi-tier technology matrix (Languages, AI & ML, Distributed Frameworks, Databases & Cloud) featuring kinetic typography and interactive magnification hover/tap effects. |
| **Ch. 04** | `CERTIFICATIONS` | Verified credentials carousel and verification links across DeepLearning.AI, IBM, Coursera, Google Cloud, and Oracle. |
| **Ch. 05** | `JOURNEY` | Chronological academic timeline, university milestones (B.Tech CSE in AI @ Parul University, 8.79 CGPA), and foundational software development history. |
| **Ch. 06** | `HIRE ME` | Direct collaboration portal featuring pre-filled `mailto:` integration, real-time availability indicator, and terminal-style contact details. |

---

## 🛠️ Flagship Case Files

1. **[AgentSpace](https://github.com/callsydeepu/AgentSpace)**  
   *Multi-Agent AI Platform & Microservices Orchestration*  
   Distributed multi-agent workspace orchestrating 8 concurrent autonomous agents across research, code synthesis, and document intelligence with Redis state caching.  
   `Stack: MERN · LangChain · LangGraph · Qdrant · Redis · Docker · AWS`

2. **[ResearchMind](https://github.com/callsydeepu/ResearchMind)**  
   *Autonomous Multi-Agent AI Research System*  
   Multi-agent research pipeline coordinating specialized Search, Reader, Writer, and Critic agents via LangChain, Mistral AI, and Tavily web discovery with an interactive dark Streamlit dashboard.  
   `Stack: Python · LangChain · Mistral AI · Tavily · BeautifulSoup · Streamlit`

3. **[MockMate](https://github.com/callsydeepu/MockMate)**  
   *Multimodal Speech & Visual Signal Analysis*  
   AI interview platform combining real-time Whisper speech transcription with OpenCV and MediaPipe facial signal detection for communication feedback.  
   `Stack: Python · Whisper · OpenCV · MediaPipe · Librosa · FastAPI`

4. **[InsightEngine RAG](https://github.com/callsydeepu)**  
   *Enterprise Hybrid Retrieval-Augmented Generation*  
   Hybrid dense-sparse retrieval system combining ChromaDB embeddings and BM25 ranking with cross-encoder reranking and citation tracking.  
   `Stack: Python · LangChain · ChromaDB · HuggingFace · FastAPI · Docker`

5. **[DispatchPilot](https://github.com/callsydeepu)**  
   *Autonomous Customer Operations Agent*  
   Production agent workflow orchestrating triage, automated email response generation, and ticket routing with human-in-the-loop escalation.  
   `Stack: Python · LangGraph · FastAPI · PostgreSQL · Redis · Celery`

---

## ✨ Engineering & Design Highlights

- **Cinematic Illumination Engine**: Interactive spotlight physics following mouse cursor and touch positions via `requestAnimationFrame` with smooth exponential damping, paired with a global **LIGHTS ON / OFF** toggle managed via React Context.
- **Balanced 3-Column Navbar**: Clean layout utilizing CSS Grid (`grid-cols-2 lg:grid-cols-[1fr_auto_1fr]`):
  - **Left**: Compact monogram badge (`S • D`) and branding typography with dedicated breathing room.
  - **Center**: Single-line navigation links with centered yellow underline indicators.
  - **Right**: Controls grouping (Lights toggle, Resume PDF, Admin CMS Lock).
- **Mobile Responsive Experience**: Animated full-screen drawer menu with smooth gesture support, backdrop blur, active section indicators, and zero horizontal overflow.
- **Interactive Kinetic Toolkit**: Interactive GSAP magnification effect allowing users to enlarge skill badges on hover or tap without layout disruption.
- **Headless CMS & Static Fallback**: Integrated SQLite-backed content management system for local development, pairing with static fallback configuration for GitHub Pages deployment.
- **Automated CI/CD**: Seamless GitHub Actions workflow deploying production builds directly to GitHub Pages on every push to `main` with Node.js 22.x compatibility.

---

## 💻 Tech Stack & Tools

- **Core**: [React 18](https://react.dev/) · [TypeScript 5.6](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) · Custom CSS Variables
- **Animations & Interaction**: [GSAP 3.15 (GreenSock)](https://greensock.com/gsap/) · [ScrollTrigger](https://greensock.com/scrolltrigger/) · [Framer Motion 11](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build & Bundler**: [Vite 6](https://vitejs.dev/)
- **Deployment**: [GitHub Pages](https://pages.github.com/) · [GitHub Actions](https://github.com/features/actions)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `22.5.0` or newer recommended (compatible with Node 20+)
- **npm**: `10.x` or newer

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/callsydeepu/callsydeepu.github.io.git
   cd callsydeepu.github.io
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Run the production build:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 📁 Repository Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment to GitHub Pages
├── public/
│   ├── portrait.webp           # Hero section portrait asset
│   ├── portrait-cutout.webp    # Spotlight cutout mask asset
│   └── Sai_Deepak_Ambati_Resume.pdf # Active resume file
├── src/
│   ├── components/             # React UI components
│   │   ├── Navbar.tsx          # 3-column responsive header & mobile drawer
│   │   ├── HeroSubject.tsx     # Ch. 01: Subject & cinematic illumination
│   │   ├── ChapterCaseFiles.tsx# Ch. 02: Featured project case studies
│   │   ├── ChapterToolkit.tsx  # Ch. 03: Tech stack with interactive hover
│   │   ├── Certifications.tsx  # Ch. 04: Verified credentials showcase
│   │   ├── ChapterJourney.tsx  # Ch. 05: Academic & milestone timeline
│   │   ├── ContactTerminal.tsx # Ch. 06: Terminal contact & mailto CTA
│   │   ├── Footer.tsx          # Site colophon & signature
│   │   └── admin/              # Local headless CMS modal & dashboard
│   ├── context/
│   │   └── PortfolioContext.tsx# Centralized state (lighting, bio, CMS data)
│   ├── config/
│   │   └── api.ts              # API fetch routing for local CMS vs static fallback
│   ├── data.ts                 # Source of truth portfolio content & project data
│   ├── index.css               # Design system typography, utilities, scanlines
│   ├── main.tsx                # React application entry point
│   └── App.tsx                 # Root layout container
├── server/
│   ├── index.js                # Local CMS server (SQLite integration)
│   └── apiPlugin.js            # Vite development API plugin
├── package.json                # Project dependencies and build scripts
├── vite.config.ts              # Vite configuration with production SSR safe guards
└── README.md                   # Project documentation
```

---

## 📬 Contact & Connect

- **Email**: [deepakambati5@gmail.com](mailto:deepakambati5@gmail.com)
- **LinkedIn**: [linkedin.com/in/sai-deepak-ambati-85454b31b](https://www.linkedin.com/in/sai-deepak-ambati-85454b31b/)
- **GitHub**: [github.com/callsydeepu](https://github.com/callsydeepu)
- **LeetCode**: [leetcode.com/u/sai_deepak2005](https://leetcode.com/u/sai_deepak2005/)

---

© 2026 Sai Deepak Ambati. All rights reserved. Built with precision and dark cinematic aesthetics.
