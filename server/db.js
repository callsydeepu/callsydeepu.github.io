import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, "../portfolio.db");

// Initialize SQLite database
export const db = new DatabaseSync(DB_PATH);

// Enable WAL mode for high concurrency & performance
try {
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA synchronous = NORMAL;");
} catch (e) {
  // Ignored if PRAGMA is restricted
}

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS bio (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    displaySurname TEXT,
    displayName TEXT,
    role TEXT,
    positioning TEXT,
    primaryLanguage TEXT,
    secondaryHighlight TEXT,
    cgpa TEXT,
    cgpaLabel TEXT,
    university TEXT,
    degree TEXT,
    timeline TEXT,
    location TEXT,
    email TEXT,
    phone TEXT,
    github TEXT,
    linkedin TEXT,
    leetcode TEXT,
    summary TEXT,
    manifestoLead TEXT,
    manifestoSub TEXT,
    status TEXT,
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS certifications (
    id TEXT PRIMARY KEY,
    number TEXT,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    year TEXT NOT NULL,
    category TEXT NOT NULL,
    domain TEXT,
    credentialType TEXT,
    link TEXT,
    highlight INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    sublabel TEXT,
    name TEXT NOT NULL,
    is_highlight INTEGER DEFAULT 0,
    line_number INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    number TEXT,
    title TEXT NOT NULL,
    subtitle TEXT,
    category TEXT NOT NULL,
    year TEXT NOT NULL,
    description TEXT NOT NULL,
    stack TEXT NOT NULL, -- JSON array
    github TEXT,
    visualType TEXT DEFAULT 'agents',
    accent TEXT DEFAULT 'yellow',
    metrics TEXT, -- JSON array
    featured INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    ip_hash TEXT
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    token TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS rate_limits (
    key TEXT PRIMARY KEY,
    attempts INTEGER DEFAULT 1,
    last_attempt TEXT NOT NULL,
    blocked_until TEXT
  );
`);

// Seed default initial data if tables are empty
export function seedInitialData() {
  const bioCheck = db.prepare("SELECT COUNT(*) as count FROM bio").get();
  if (bioCheck.count === 0) {
    const insertBio = db.prepare(`
      INSERT INTO bio (
        id, name, displaySurname, displayName, role, positioning,
        primaryLanguage, secondaryHighlight, cgpa, cgpaLabel,
        university, degree, timeline, location, email, phone,
        github, linkedin, leetcode, summary, manifestoLead, manifestoSub, status, updated_at
      ) VALUES (
        'main',
        'Sai Deepak Ambati',
        'AMBATI',
        'SAI DEEPAK',
        'AI & Systems undergraduate. Full-stack developer. Agentic first, systems always.',
        'AI & ML / GenAI / Full-Stack Developer',
        'PYTHON — PRIMARY LANGUAGE',
        'AI × MULTI-AGENT ARCHITECTURE',
        '8.79',
        'CGPA — B.TECH AI & CSE',
        'Parul University',
        'B. Tech in Computer Science & Engineering (AI)',
        'Sept 2023 — May 2027',
        'Vadodara, Gujarat, India',
        'deepakambati5@gmail.com',
        '+91 6281658698',
        'https://github.com/callsydeepu',
        'https://www.linkedin.com/in/sai-deepak-ambati-85454b31b/',
        'https://leetcode.com/u/sai_deepak2005/',
        'AI Engineer with hands-on experience building LLM, RAG, and multi-agent AI applications using Python, LangChain, LangGraph, and FastAPI. Passionate about practical, scalable AI solutions and distributed backend systems.',
        'STUDYING HOW MACHINES LEARN.',
        'Building the systems they run on.',
        'Open to High-Impact Opportunities',
        datetime('now')
      )
    `);
    insertBio.run();
  }

  const certsCheck = db.prepare("SELECT COUNT(*) as count FROM certifications").get();
  if (certsCheck.count === 0) {
    const defaultCerts = [
      {
        id: "oci-2025",
        number: "01",
        title: "Oracle Cloud Infrastructure (OCI) 2025 Certified Data Science Professional",
        issuer: "Oracle",
        year: "2025",
        category: "CLOUD",
        domain: "Cloud Computing & Data Science",
        credentialType: "Professional Certification",
        link: "",
        highlight: 1,
        sort_order: 1
      },
      {
        id: "mysql-iit",
        number: "02",
        title: "MySQL Certification",
        issuer: "IIT Indore",
        year: "2025",
        category: "DATA",
        domain: "Database Systems & SQL Architecture",
        credentialType: "Technical Certification",
        link: "",
        highlight: 0,
        sort_order: 2
      },
      {
        id: "genai-langchain",
        number: "03",
        title: "Generative AI with LangChain and Hugging Face",
        issuer: "Udemy",
        year: "2026",
        category: "AI / ML",
        domain: "LLM Orchestration & Agentic AI",
        credentialType: "Specialized Training",
        link: "",
        highlight: 0,
        sort_order: 3
      },
      {
        id: "fullstack-apna",
        number: "04",
        title: "Full Stack Web Development",
        issuer: "Apna College",
        year: "2025",
        category: "BACKEND",
        domain: "Full-Stack Web Engineering",
        credentialType: "Comprehensive Course",
        link: "",
        highlight: 0,
        sort_order: 4
      },
      {
        id: "python-intellipaat",
        number: "05",
        title: "Python Preparatory Certification",
        issuer: "Intellipaat",
        year: "2026",
        category: "AI / ML",
        domain: "Applied Python & Foundations",
        credentialType: "Preparatory Certification",
        link: "",
        highlight: 0,
        sort_order: 5
      }
    ];

    const insertCert = db.prepare(`
      INSERT INTO certifications (id, number, title, issuer, year, category, domain, credentialType, link, highlight, sort_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    for (const cert of defaultCerts) {
      insertCert.run(
        cert.id,
        cert.number,
        cert.title,
        cert.issuer,
        cert.year,
        cert.category,
        cert.domain,
        cert.credentialType,
        cert.link,
        cert.highlight,
        cert.sort_order
      );
    }
  }

  const skillsCheck = db.prepare("SELECT COUNT(*) as count FROM skills").get();
  if (skillsCheck.count === 0) {
    const defaultSkills = [
      // PROGRAMMING LANGUAGES
      { category: "PROGRAMMING LANGUAGES", sublabel: "PRIMARY //", name: "PYTHON", is_highlight: 1, line_number: 1, sort_order: 1 },
      { category: "PROGRAMMING LANGUAGES", sublabel: "PRIMARY //", name: "JAVASCRIPT", is_highlight: 0, line_number: 1, sort_order: 2 },
      { category: "PROGRAMMING LANGUAGES", sublabel: "PRIMARY //", name: "SQL", is_highlight: 0, line_number: 1, sort_order: 3 },
      { category: "PROGRAMMING LANGUAGES", sublabel: "PRIMARY //", name: "C++", is_highlight: 0, line_number: 1, sort_order: 4 },

      // AI & MACHINE LEARNING
      { category: "AI & MACHINE LEARNING", sublabel: "", name: "MACHINE LEARNING", is_highlight: 0, line_number: 1, sort_order: 1 },
      { category: "AI & MACHINE LEARNING", sublabel: "", name: "DEEP LEARNING", is_highlight: 0, line_number: 1, sort_order: 2 },
      { category: "AI & MACHINE LEARNING", sublabel: "", name: "LLMS", is_highlight: 0, line_number: 2, sort_order: 3 },
      { category: "AI & MACHINE LEARNING", sublabel: "", name: "RAG", is_highlight: 0, line_number: 2, sort_order: 4 },
      { category: "AI & MACHINE LEARNING", sublabel: "", name: "LANGCHAIN", is_highlight: 0, line_number: 2, sort_order: 5 },
      { category: "AI & MACHINE LEARNING", sublabel: "", name: "LANGGRAPH", is_highlight: 0, line_number: 2, sort_order: 6 },

      // BACKEND & APIS
      { category: "BACKEND & APIS", sublabel: "", name: "FASTAPI", is_highlight: 0, line_number: 1, sort_order: 1 },
      { category: "BACKEND & APIS", sublabel: "", name: "NODE.JS", is_highlight: 0, line_number: 1, sort_order: 2 },
      { category: "BACKEND & APIS", sublabel: "", name: "EXPRESS.JS", is_highlight: 0, line_number: 1, sort_order: 3 },
      { category: "BACKEND & APIS", sublabel: "", name: "RESTFUL APIS", is_highlight: 0, line_number: 2, sort_order: 4 },
      { category: "BACKEND & APIS", sublabel: "", name: "JWT AUTH", is_highlight: 0, line_number: 2, sort_order: 5 },
      { category: "BACKEND & APIS", sublabel: "", name: "MICROSERVICES", is_highlight: 0, line_number: 2, sort_order: 6 },

      // DATABASES
      { category: "DATABASES", sublabel: "", name: "MONGODB", is_highlight: 0, line_number: 1, sort_order: 1 },
      { category: "DATABASES", sublabel: "", name: "MYSQL", is_highlight: 0, line_number: 1, sort_order: 2 },
      { category: "DATABASES", sublabel: "", name: "REDIS", is_highlight: 0, line_number: 1, sort_order: 3 },
      { category: "DATABASES", sublabel: "", name: "QDRANT", is_highlight: 0, line_number: 1, sort_order: 4 },

      // DATA ANALYSIS
      { category: "DATA ANALYSIS", sublabel: "", name: "PANDAS", is_highlight: 0, line_number: 1, sort_order: 1 },
      { category: "DATA ANALYSIS", sublabel: "", name: "NUMPY", is_highlight: 0, line_number: 1, sort_order: 2 },
      { category: "DATA ANALYSIS", sublabel: "", name: "STREAMLIT", is_highlight: 0, line_number: 1, sort_order: 3 },

      // TOOLS & CLOUD
      { category: "TOOLS & CLOUD", sublabel: "", name: "GIT", is_highlight: 0, line_number: 1, sort_order: 1 },
      { category: "TOOLS & CLOUD", sublabel: "", name: "GITHUB", is_highlight: 0, line_number: 1, sort_order: 2 },
      { category: "TOOLS & CLOUD", sublabel: "", name: "DOCKER", is_highlight: 0, line_number: 1, sort_order: 3 },
      { category: "TOOLS & CLOUD", sublabel: "", name: "AWS", is_highlight: 0, line_number: 1, sort_order: 4 },
      { category: "TOOLS & CLOUD", sublabel: "", name: "POSTMAN", is_highlight: 0, line_number: 1, sort_order: 5 }
    ];

    const insertSkill = db.prepare(`
      INSERT INTO skills (id, category, sublabel, name, is_highlight, line_number, sort_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    for (let i = 0; i < defaultSkills.length; i++) {
      const s = defaultSkills[i];
      insertSkill.run(`skill-${i + 1}`, s.category, s.sublabel, s.name, s.is_highlight, s.line_number, s.sort_order);
    }
  }

  const projectsCheck = db.prepare("SELECT COUNT(*) as count FROM projects").get();
  if (projectsCheck.count === 0) {
    const defaultProjects = [
      {
        id: "agentspace",
        number: "01",
        title: "AGENTSPACE",
        subtitle: "Multi-Agent AI Platform & Microservices Orchestration",
        category: "AUTONOMOUS AGENTS",
        year: "2026",
        description:
          "A distributed multi-agent workspace orchestrating 8 concurrent AI agents across specialized domains including research, code synthesis, and document intelligence with Redis state caching reducing average latency by 40%.",
        stack: JSON.stringify(["MERN", "LANGCHAIN", "LANGGRAPH", "QDRANT", "REDIS", "DOCKER", "AWS"]),
        github: "https://github.com/callsydeepu/AgentSpace",
        visualType: "agents",
        accent: "yellow",
        metrics: JSON.stringify([
          { value: "08", label: "AUTONOMOUS AGENTS", highlight: true },
          { value: "-40%", label: "CACHE LATENCY (REDIS)" },
          { value: "99.4%", label: "SERVICE UPTIME" },
          { value: "100%", label: "TYPE SAFETY" }
        ]),
        featured: 1,
        sort_order: 1
      },
      {
        id: "researchmind",
        number: "02",
        title: "RESEARCHMIND",
        subtitle: "Autonomous Multi-Agent AI Research System",
        category: "MULTI-AGENT RESEARCH",
        year: "2026",
        description:
          "An autonomous multi-agent research system that coordinates specialized Search, Reader, Writer, and Critic agents via LangChain and Mistral AI, with Tavily web discovery, BeautifulSoup content extraction, and an interactive dark Streamlit dashboard.",
        stack: JSON.stringify(["PYTHON", "LANGCHAIN", "MISTRAL AI", "TAVILY", "BEAUTIFULSOUP", "STREAMLIT"]),
        github: "https://github.com/callsydeepu/ResearchMind",
        visualType: "data",
        accent: "violet",
        metrics: JSON.stringify([
          { value: "04", label: "SPECIALIZED AGENTS", highlight: true },
          { value: "3,000", label: "CHARS SCRAPED / DOC" },
          { value: "100%", label: "STRUCTURED MARKDOWN" },
          { value: "LIVE", label: "STREAMLIT DASHBOARD" }
        ]),
        featured: 1,
        sort_order: 2
      },
      {
        id: "mockmate",
        number: "03",
        title: "MOCKMATE",
        subtitle: "Multimodal Speech & Visual Signal Analysis",
        category: "AI INTERVIEW COACH",
        year: "2026",
        description:
          "An AI interview practice platform combining real-time Whisper speech transcription with OpenCV and MediaPipe facial signal detection to deliver pacing, clarity, and communication feedback.",
        stack: JSON.stringify(["PYTHON", "WHISPER", "OPENCV", "MEDIAPIPE", "LIBROSA", "FASTAPI"]),
        github: "https://github.com/callsydeepu/MockMate",
        visualType: "interview",
        accent: "blue",
        metrics: JSON.stringify([
          { value: "92%", label: "PACING ACCURACY", highlight: true },
          { value: "138 WPM", label: "OPTIMAL CADENCE" },
          { value: "60 FPS", label: "SIGNAL TRACKING" },
          { value: "<100ms", label: "WHISPER INFERENCE" }
        ]),
        featured: 1,
        sort_order: 3
      },
      {
        id: "cognitive-rag",
        number: "04",
        title: "COGNITIVE RAG APPLICATION",
        subtitle: "Air-Gapped Document Intelligence & Local LLMs",
        category: "PRIVACY AI",
        year: "2025",
        description:
          "An end-to-end local document processing engine enabling zero-leakage PDF questioning via Ollama local inference, Nomic embeddings, and persistent ChromaDB semantic retrieval with FastAPI endpoints.",
        stack: JSON.stringify(["FASTAPI", "PYTHON", "LANGCHAIN", "CHROMADB", "OLLAMA", "NOMIC"]),
        github: "https://github.com/callsydeepu/Production-RAG-Engine",
        visualType: "rag",
        accent: "coral",
        metrics: JSON.stringify([
          { value: "0%", label: "DATA LEAKAGE (AIR-GAPPED)", highlight: true },
          { value: "0.88", label: "COSINE SIMILARITY" },
          { value: "50+", label: "PAPERS INDEXED" },
          { value: "LOCAL", label: "OLLAMA EMBEDDINGS" }
        ]),
        featured: 1,
        sort_order: 4
      },
      {
        id: "system-anomaly",
        number: "05",
        title: "SYSTEM ANOMALY DETECTION",
        subtitle: "Adaptive OS Anomaly Detection & ML Sentinel SOC",
        category: "AI SECURITY // ML",
        year: "2026",
        description:
          "A real-time machine-learning OS anomaly detection platform that continuously monitors live host telemetry, extracts 8 statistical behavioral features, and uses an adaptive Isolation Forest model for zero-false-positive process intrusion alerts.",
        stack: JSON.stringify(["PYTHON", "ISOLATION FOREST", "SCIKIT-LEARN", "PSUTIL", "STREAMLIT", "PANDAS"]),
        github: "https://github.com/callsydeepu/SystemAnomalyDetection",
        visualType: "email",
        accent: "emerald",
        metrics: JSON.stringify([
          { value: "08", label: "STATISTICAL FEATURES", highlight: true },
          { value: "1 SEC", label: "TELEMETRY CADENCE" },
          { value: "0%", label: "PRE-LABELED ATTACK DATA" },
          { value: "100%", label: "LOCAL PRIVACY / AIR-GAPPED" }
        ]),
        featured: 1,
        sort_order: 5
      }
    ];

    const insertProject = db.prepare(`
      INSERT INTO projects (id, number, title, subtitle, category, year, description, stack, github, visualType, accent, metrics, featured, sort_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    for (const p of defaultProjects) {
      insertProject.run(
        p.id,
        p.number,
        p.title,
        p.subtitle,
        p.category,
        p.year,
        p.description,
        p.stack,
        p.github,
        p.visualType,
        p.accent,
        p.metrics,
        p.featured,
        p.sort_order
      );
    }
  }
}

// Auto seed on import
seedInitialData();

