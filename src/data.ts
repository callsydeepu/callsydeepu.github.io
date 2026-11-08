// Source of truth: details/Sai_Deepak_Ambati_Resume_oct.pdf and repository projects

export interface ProjectMetric {
  value: string;
  label: string;
  highlight?: boolean;
}

export interface FeaturedProject {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  description: string;
  stack: string[];
  github: string;
  visualType: "agents" | "data" | "interview" | "rag" | "email";
  accent: "yellow" | "coral" | "blue" | "emerald" | "violet";
  metrics?: ProjectMetric[];
}

export interface CertificationItem {
  id: string;
  number?: string;
  title: string;
  issuer: string;
  year: string;
  category: "AI / ML" | "CLOUD" | "DATA" | "BACKEND";
  domain?: string;
  credentialType?: string;
  highlight?: boolean;
  link?: string;
}

export interface TechCategory {
  id: string;
  label: string;
  lines: {
    items: {
      name: string;
      highlight?: boolean;
    }[];
  }[];
}

export const profile = {
  name: "Sai Deepak Ambati",
  displaySurname: "AMBATI",
  displayName: "SAI DEEPAK",
  initials: "S • D",
  heroInitials: "SD",
  kicker: "AMBATI SAI DEEPAK",
  role: "AI & Systems undergraduate. Full-stack developer. Agentic first, systems always.",
  positioning: "AI & ML / GenAI / Full-Stack Developer",
  primaryLanguage: "PYTHON — PRIMARY LANGUAGE",
  secondaryHighlight: "AI × MULTI-AGENT ARCHITECTURE",
  cgpa: "8.79",
  cgpaLabel: "CGPA — B.TECH AI & CSE",
  university: "Parul University",
  degree: "B. Tech in Computer Science & Engineering (AI)",
  timeline: "Sept 2023 — May 2027",
  location: "Vadodara, Gujarat, India",
  email: "deepakambati5@gmail.com",
  phone: "+91 6281658698",
  github: "https://github.com/callsydeepu",
  linkedin: "https://www.linkedin.com/in/sai-deepak-ambati-85454b31b/",
  leetcode: "https://leetcode.com/u/sai_deepak2005/",
  resumePdf: "/Sai_Deepak_Ambati_Resume.pdf",
  portrait: "/portrait.webp",
  portraitJpg: "/portrait.jpg",
  portraitCutout: "/portrait-cutout.webp",
  portraitCutoutPng: "/portrait-cutout.png",
  summary:
    "AI Engineer with hands-on experience building LLM, RAG, and multi-agent AI applications using Python, LangChain, LangGraph, and FastAPI. Passionate about practical, scalable AI solutions and distributed backend systems.",
  manifestoLead: "STUDYING HOW MACHINES LEARN.",
  manifestoSub: "Building the systems they run on.",
  status: "Open to High-Impact Opportunities",
  education: {
    degree: "B. Tech in Computer Science & Engineering (AI)",
    institution: "Parul University",
    location: "Vadodara, Gujarat",
    timeline: "Sept 2023 — May 2027",
    cgpa: "8.79 / 10.0"
  }
};

// 5 Featured Projects for Horizontal Scroll Showcase
export const featuredProjects: FeaturedProject[] = [
  {
    id: "agentspace",
    number: "01",
    title: "AGENTSPACE",
    subtitle: "Multi-Agent AI Platform & Microservices Orchestration",
    category: "AUTONOMOUS AGENTS",
    year: "2026",
    description:
      "A distributed multi-agent workspace orchestrating 8 concurrent AI agents across specialized domains including research, code synthesis, and document intelligence with Redis state caching reducing average latency by 40%.",
    stack: ["MERN", "LANGCHAIN", "LANGGRAPH", "QDRANT", "REDIS", "DOCKER", "AWS"],
    github: "https://github.com/callsydeepu/AgentSpace",
    visualType: "agents",
    accent: "yellow",
    metrics: [
      { value: "08", label: "AUTONOMOUS AGENTS", highlight: true },
      { value: "-40%", label: "CACHE LATENCY (REDIS)" },
      { value: "99.4%", label: "SERVICE UPTIME" },
      { value: "100%", label: "TYPE SAFETY" }
    ]
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
    stack: ["PYTHON", "LANGCHAIN", "MISTRAL AI", "TAVILY", "BEAUTIFULSOUP", "STREAMLIT"],
    github: "https://github.com/callsydeepu/ResearchMind",
    visualType: "data",
    accent: "violet",
    metrics: [
      { value: "04", label: "SPECIALIZED AGENTS", highlight: true },
      { value: "3,000", label: "CHARS SCRAPED / DOC" },
      { value: "100%", label: "STRUCTURED MARKDOWN" },
      { value: "LIVE", label: "STREAMLIT DASHBOARD" }
    ]
  },
  {
    id: "mockmate",
    number: "03",
    title: "MOCKMATE",
    category: "AI INTERVIEW COACH",
    subtitle: "Multimodal Speech & Visual Signal Analysis",
    year: "2026",
    description:
      "An AI interview practice platform combining real-time Whisper speech transcription with OpenCV and MediaPipe facial signal detection to deliver pacing, clarity, and communication feedback.",
    stack: ["PYTHON", "WHISPER", "OPENCV", "MEDIAPIPE", "LIBROSA", "FASTAPI"],
    github: "https://github.com/callsydeepu/MockMate",
    visualType: "interview",
    accent: "blue",
    metrics: [
      { value: "92%", label: "PACING ACCURACY", highlight: true },
      { value: "138 WPM", label: "OPTIMAL CADENCE" },
      { value: "60 FPS", label: "SIGNAL TRACKING" },
      { value: "<100ms", label: "WHISPER INFERENCE" }
    ]
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
    stack: ["FASTAPI", "PYTHON", "LANGCHAIN", "CHROMADB", "OLLAMA", "NOMIC"],
    github: "https://github.com/callsydeepu/Production-RAG-Engine",
    visualType: "rag",
    accent: "coral",
    metrics: [
      { value: "0%", label: "DATA LEAKAGE (AIR-GAPPED)", highlight: true },
      { value: "0.88", label: "COSINE SIMILARITY" },
      { value: "50+", label: "PAPERS INDEXED" },
      { value: "LOCAL", label: "OLLAMA EMBEDDINGS" }
    ]
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
    stack: ["PYTHON", "ISOLATION FOREST", "SCIKIT-LEARN", "PSUTIL", "STREAMLIT", "PANDAS"],
    github: "https://github.com/callsydeepu/SystemAnomalyDetection",
    visualType: "email",
    accent: "emerald",
    metrics: [
      { value: "08", label: "STATISTICAL FEATURES", highlight: true },
      { value: "1 SEC", label: "TELEMETRY CADENCE" },
      { value: "0%", label: "PRE-LABELED ATTACK DATA" },
      { value: "100%", label: "LOCAL PRIVACY / AIR-GAPPED" }
    ]
  }
];

export const caseStudies = featuredProjects;
export const projects = featuredProjects;

// Tech Stack categories from verified resume skills
export const techCategories: TechCategory[] = [
  {
    id: "languages",
    label: "PROGRAMMING LANGUAGES",
    lines: [
      {
        items: [
          { name: "PYTHON", highlight: true },
          { name: "JAVASCRIPT" },
          { name: "SQL" },
          { name: "C++" }
        ]
      }
    ]
  },
  {
    id: "ai-ml",
    label: "AI / MACHINE LEARNING",
    lines: [
      {
        items: [
          { name: "MACHINE LEARNING" },
          { name: "DEEP LEARNING" },
          { name: "LLMS" },
          { name: "RAG" }
        ]
      },
      {
        items: [
          { name: "LANGCHAIN" },
          { name: "LANGGRAPH" }
        ]
      }
    ]
  },
  {
    id: "backend",
    label: "BACKEND & APIS",
    lines: [
      {
        items: [
          { name: "FASTAPI", highlight: true },
          { name: "NODE.JS" },
          { name: "EXPRESS.JS" }
        ]
      },
      {
        items: [
          { name: "RESTFUL APIS" },
          { name: "JWT AUTHENTICATION" },
          { name: "MICROSERVICES ARCHITECTURE" }
        ]
      }
    ]
  },
  {
    id: "databases",
    label: "DATABASES",
    lines: [
      {
        items: [
          { name: "MONGODB" },
          { name: "MYSQL" },
          { name: "REDIS" },
          { name: "QDRANT" }
        ]
      }
    ]
  },
  {
    id: "data-analysis",
    label: "DATA ANALYSIS",
    lines: [
      {
        items: [
          { name: "PANDAS" },
          { name: "NUMPY" },
          { name: "STREAMLIT" }
        ]
      }
    ]
  },
  {
    id: "tools",
    label: "TOOLS & CLOUD",
    lines: [
      {
        items: [
          { name: "GIT" },
          { name: "GITHUB" },
          { name: "DOCKER" },
          { name: "AWS" },
          { name: "POSTMAN" }
        ]
      }
    ]
  }
];

export const skillGroups = [
  {
    category: "Languages",
    badge: "SYNTAX",
    description: "Core programming languages.",
    skills: [
      { name: "Python", highlight: true },
      { name: "Java" },
      { name: "C++" },
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "SQL" }
    ]
  },
  {
    category: "Frontend",
    badge: "INTERFACE",
    description: "Modern web user interfaces.",
    skills: [
      { name: "React", highlight: true },
      { name: "HTML" },
      { name: "CSS" },
      { name: "Tailwind CSS" }
    ]
  },
  {
    category: "Backend",
    badge: "SYSTEMS",
    description: "High-throughput APIs and server architectures.",
    skills: [
      { name: "FastAPI", highlight: true },
      { name: "Node.js" },
      { name: "Express.js" },
      { name: "Flask" },
      { name: "REST APIs" }
    ]
  },
  {
    category: "AI & ML",
    badge: "INTELLIGENCE",
    description: "Agentic systems and language model pipelines.",
    skills: [
      { name: "LangGraph", highlight: true },
      { name: "LangChain" },
      { name: "Generative AI", highlight: true },
      { name: "RAG" },
      { name: "Machine Learning" },
      { name: "NLP" }
    ]
  },
  {
    category: "Databases",
    badge: "PERSISTENCE",
    description: "Vector, document, and relational data stores.",
    skills: [
      { name: "Qdrant", highlight: true },
      { name: "MongoDB" },
      { name: "MySQL" },
      { name: "Redis", highlight: true },
      { name: "ChromaDB" }
    ]
  },
  {
    category: "Tools & Infrastructure",
    badge: "OPERATIONS",
    description: "Containerization and cloud deployment.",
    skills: [
      { name: "Docker", highlight: true },
      { name: "AWS" },
      { name: "Git" },
      { name: "GitHub" }
    ]
  }
];

export const trackRecordStats = [
  { value: "8.79", label: "B.Tech CGPA", note: "Parul University · AI Branch Distinction" },
  { value: "08", label: "Concurrent Agents", note: "Orchestrated in AgentSpace platform" },
  { value: "-40%", label: "Query Latency Cut", note: "Redis caching layer in microservices" },
  { value: "100+", label: "Documents Indexed", note: "Air-gapped RAG document pipeline" },
  { value: "200+", label: "Algorithmic Problems", note: "LeetCode & CodeChef problem solving" }
];

export const editorialStats = trackRecordStats;

export const certifications: CertificationItem[] = [
  {
    id: "oci-2025",
    number: "01",
    title: "Oracle Cloud Infrastructure (OCI) 2025 Certified Data Science Professional",
    issuer: "Oracle",
    year: "2025",
    category: "CLOUD",
    domain: "Cloud Computing & Data Science",
    credentialType: "Professional Certification",
    highlight: true
  },
  {
    id: "mysql-iit",
    number: "02",
    title: "MySQL Certification",
    issuer: "IIT Indore",
    year: "2025",
    category: "DATA",
    domain: "Database Systems & SQL Architecture",
    credentialType: "Technical Certification"
  },
  {
    id: "genai-langchain",
    number: "03",
    title: "Generative AI with LangChain and Hugging Face",
    issuer: "Udemy",
    year: "2026",
    category: "AI / ML",
    domain: "LLM Orchestration & Agentic AI",
    credentialType: "Specialized Training"
  },
  {
    id: "fullstack-apna",
    number: "04",
    title: "Full Stack Web Development",
    issuer: "Apna College",
    year: "2025",
    category: "BACKEND",
    domain: "Full-Stack Web Engineering",
    credentialType: "Comprehensive Course"
  },
  {
    id: "python-intellipaat",
    number: "05",
    title: "Python Preparatory Certification",
    issuer: "Intellipaat",
    year: "2026",
    category: "AI / ML",
    domain: "Applied Python & Foundations",
    credentialType: "Preparatory Certification"
  }
];

export interface EducationStage {
  id: string;
  number: string;
  level: string;
  degreeTitle: string;
  institution: string;
  location: string;
  period?: string;
  status?: string;
  isCurrent?: boolean;
  focusAreas?: string[];
  percentage?: string;
}

export const educationTimeline: EducationStage[] = [
  {
    id: "btech-ai",
    number: "01",
    level: "HIGHER EDUCATION",
    degreeTitle: "B.Tech | Computer Science & Engineering – AI",
    institution: "Parul University",
    location: "Vadodara, Gujarat",
    period: "2023 – 2027",
    status: "Currently Pursuing",
    isCurrent: true,
    focusAreas: [
      "Artificial Intelligence",
      "Machine Learning",
      "Full-Stack Development",
      "Data Structures & Algorithms",
      "Python"
    ]
  },
  {
    id: "intermediate",
    number: "02",
    level: "PRE-UNIVERSITY",
    degreeTitle: "Intermediate",
    institution: "Sri Chaitanya Junior College",
    location: "Visakhapatnam, Andhra Pradesh",
    percentage: "94%",
    isCurrent: false
  },
  {
    id: "secondary",
    number: "03",
    level: "SECONDARY EDUCATION",
    degreeTitle: "Secondary School",
    institution: "Sri Chaitanya School",
    location: "Visakhapatnam, Andhra Pradesh",
    percentage: "98.67%",
    isCurrent: false
  }
];
