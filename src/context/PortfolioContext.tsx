import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiFetch } from "../config/api";
import {
  profile as initialProfile,
  certifications as initialCertifications,
  featuredProjects as initialProjects,
  CertificationItem,
  FeaturedProject
} from "../data";

export interface TechGroup {
  category: string;
  sublabel?: string;
  lines: {
    highlight?: string;
    items: string[];
  }[];
}

export interface RawSkill {
  id: string;
  category: string;
  sublabel?: string;
  name: string;
  is_highlight: number;
  line_number: number;
  sort_order: number;
}

export interface BioData {
  name: string;
  displaySurname?: string;
  displayName?: string;
  role?: string;
  positioning?: string;
  primaryLanguage?: string;
  secondaryHighlight?: string;
  summary?: string;
  manifestoLead?: string;
  manifestoSub?: string;
  location?: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  leetcode?: string;
  status?: string;
  cgpa?: string;
  university?: string;
  degree?: string;
  timeline?: string;
}

interface PortfolioContextType {
  bio: BioData;
  certifications: CertificationItem[];
  techStackGroups: TechGroup[];
  rawSkills: RawSkill[];
  projects: FeaturedProject[];
  isLoading: boolean;
  refreshPortfolio: () => Promise<void>;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

// Initial fallback TechStackGroups matching ChapterToolkit
const initialTechStackGroups: TechGroup[] = [
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
      { items: ["MACHINE LEARNING", "DEEP LEARNING"] },
      { items: ["LLMS", "RAG", "LANGCHAIN", "LANGGRAPH"] }
    ]
  },
  {
    category: "BACKEND & APIS",
    lines: [
      { items: ["FASTAPI", "NODE.JS", "EXPRESS.JS"] },
      { items: ["RESTFUL APIS", "JWT AUTH", "MICROSERVICES"] }
    ]
  },
  {
    category: "DATABASES",
    lines: [{ items: ["MONGODB", "MYSQL", "REDIS", "QDRANT"] }]
  },
  {
    category: "DATA ANALYSIS",
    lines: [{ items: ["PANDAS", "NUMPY", "STREAMLIT"] }]
  },
  {
    category: "TOOLS & CLOUD",
    lines: [{ items: ["GIT", "GITHUB", "DOCKER", "AWS", "POSTMAN"] }]
  }
];

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [bio, setBio] = useState<BioData>(initialProfile);
  const [certifications, setCertifications] = useState<CertificationItem[]>(initialCertifications);
  const [techStackGroups, setTechStackGroups] = useState<TechGroup[]>(initialTechStackGroups);
  const [rawSkills, setRawSkills] = useState<RawSkill[]>([]);
  const [projects, setProjects] = useState<FeaturedProject[]>(initialProjects);
  const [isLoading, setIsLoading] = useState(false);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth on mount
  useEffect(() => {
    apiFetch("/api/auth/verify")
      .then((res) => {
        if (!res.ok) {
          setIsAuthenticated(false);
          localStorage.removeItem("admin_token");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("admin_token");
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  // Fetch live portfolio data from backend SQLite
  const refreshPortfolio = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        if (data.bio) setBio(data.bio);
        if (data.certifications && data.certifications.length > 0) {
          setCertifications(data.certifications);
        }
        if (data.techStackGroups && data.techStackGroups.length > 0) {
          setTechStackGroups(data.techStackGroups);
        }
        if (data.rawSkills) {
          setRawSkills(data.rawSkills);
        }
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
        }
      }
    } catch (e) {
      console.warn("Could not fetch live portfolio data, using bundled fallback:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPortfolio();
  }, [refreshPortfolio]);

  return (
    <PortfolioContext.Provider
      value={{
        bio,
        certifications,
        techStackGroups,
        rawSkills,
        projects,
        isLoading,
        refreshPortfolio,
        isAdminOpen,
        setIsAdminOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isAuthenticated,
        setIsAuthenticated
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolioData must be used within a PortfolioProvider");
  }
  return context;
}

