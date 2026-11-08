import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Award,
  Cpu,
  FolderGit2,
  User,
  Inbox,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Check,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Search,
  Star,
  Eye,
  Mail,
  ShieldCheck,
  AlertCircle,
  Loader2,
  X
} from "lucide-react";
import { usePortfolioData, RawSkill } from "../../context/PortfolioContext";
import { CertificationItem, FeaturedProject } from "../../data";

type TabType = "overview" | "certifications" | "skills" | "projects" | "bio" | "messages";

interface OverviewStats {
  certCount: number;
  skillCount: number;
  projectCount: number;
  totalMessages: number;
  unreadMessages: number;
  recentMessages: any[];
}

interface DeleteConfirmState {
  isOpen: boolean;
  type: "cert" | "skill" | "project" | "message";
  id: string;
  title: string;
}

export function AdminDashboard() {
  const {
    isAdminOpen,
    setIsAdminOpen,
    setIsAuthenticated,
    bio,
    certifications,
    rawSkills,
    projects,
    refreshPortfolio
  } = usePortfolioData();

  // Tab persistence in sessionStorage so browser refreshes stay on the active tab
  const [activeTab, setActiveTabState] = useState<TabType>(() => {
    return (sessionStorage.getItem("admin_active_tab") as TabType) || "overview";
  });

  const setActiveTab = (tab: TabType) => {
    sessionStorage.setItem("admin_active_tab", tab);
    setActiveTabState(tab);
  };

  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Granular non-blocking loading & mutation states
  const [savingType, setSavingType] = useState<"cert" | "skill" | "project" | "bio" | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState | null>(null);

  // Modals & form states
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificationItem | null>(null);
  const [certForm, setCertForm] = useState({
    title: "",
    issuer: "",
    year: "2025",
    category: "AI / ML",
    domain: "",
    credentialType: "Professional Certification",
    link: "",
    highlight: false
  });

  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<RawSkill | null>(null);
  const [skillForm, setSkillForm] = useState({
    name: "",
    category: "PROGRAMMING LANGUAGES",
    sublabel: "",
    is_highlight: false,
    line_number: 1
  });

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<FeaturedProject | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    subtitle: "",
    category: "AUTONOMOUS AGENTS",
    year: "2026",
    description: "",
    stack: "",
    github: "",
    visualType: "agents",
    accent: "yellow",
    featured: true
  });

  const [bioForm, setBioForm] = useState({ ...bio });
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  // Show auto-dismissing toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch overview stats and messages
  const fetchOverview = async () => {
    try {
      const res = await fetch("/api/admin/overview");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Error fetching overview stats:", e);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error("Error fetching messages:", e);
    }
  };

  useEffect(() => {
    if (isAdminOpen) {
      fetchOverview();
      fetchMessages();
      setBioForm({ ...bio });
    }
  }, [isAdminOpen, bio]);

  if (!isAdminOpen) return null;

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    setIsAuthenticated(false);
    setIsAdminOpen(false);
  };

  // -------------------------------------------------------------
  // CERTIFICATIONS HANDLERS
  // -------------------------------------------------------------
  const openNewCertModal = () => {
    setEditingCert(null);
    setFormError(null);
    setCertForm({
      title: "",
      issuer: "",
      year: new Date().getFullYear().toString(),
      category: "AI / ML",
      domain: "",
      credentialType: "Certificate",
      link: "",
      highlight: false
    });
    setCertModalOpen(true);
  };

  const openEditCertModal = (cert: CertificationItem) => {
    setEditingCert(cert);
    setFormError(null);
    setCertForm({
      title: cert.title,
      issuer: cert.issuer,
      year: cert.year,
      category: cert.category,
      domain: cert.domain || "",
      credentialType: cert.credentialType || "Certificate",
      link: cert.link || "",
      highlight: !!cert.highlight
    });
    setCertModalOpen(true);
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingType) return; // Prevent duplicate submission

    if (!certForm.title.trim()) {
      setFormError("Certification title is required.");
      return;
    }
    if (!certForm.issuer.trim()) {
      setFormError("Issuing organization is required.");
      return;
    }

    setSavingType("cert");
    setFormError(null);

    try {
      const url = editingCert
        ? `/api/admin/certifications/${editingCert.id}`
        : "/api/admin/certifications";
      const method = editingCert ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(certForm)
      });

      const data = await res.json();

      if (!res.ok) {
        // Keep form intact and show exact server error message
        setFormError(data.error || "Failed to save certification. Please review your entries and retry.");
        return;
      }

      // Success confirmed by backend
      await refreshPortfolio();
      await fetchOverview();
      setCertModalOpen(false);
      showToast(editingCert ? "Certification updated successfully." : "New certification created.");
    } catch (err) {
      setFormError("Network or server connection error. Please try again.");
    } finally {
      setSavingType(null);
    }
  };

  // -------------------------------------------------------------
  // SKILLS HANDLERS
  // -------------------------------------------------------------
  const openNewSkillModal = (defaultCategory?: string) => {
    setEditingSkill(null);
    setFormError(null);
    setSkillForm({
      name: "",
      category: defaultCategory || "PROGRAMMING LANGUAGES",
      sublabel: "",
      is_highlight: false,
      line_number: 1
    });
    setSkillModalOpen(true);
  };

  const openEditSkillModal = (skill: RawSkill) => {
    setEditingSkill(skill);
    setFormError(null);
    setSkillForm({
      name: skill.name,
      category: skill.category,
      sublabel: skill.sublabel || "",
      is_highlight: !!skill.is_highlight,
      line_number: skill.line_number || 1
    });
    setSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingType) return; // Prevent duplicate clicks

    if (!skillForm.name.trim()) {
      setFormError("Skill name cannot be empty.");
      return;
    }

    setSavingType("skill");
    setFormError(null);

    try {
      const url = editingSkill ? `/api/admin/skills/${editingSkill.id}` : "/api/admin/skills";
      const method = editingSkill ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillForm)
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Failed to save skill. Check the category and name.");
        return;
      }

      await refreshPortfolio();
      await fetchOverview();
      setSkillModalOpen(false);
      showToast(editingSkill ? `Skill ${skillForm.name} updated.` : `Skill ${skillForm.name} added.`);
    } catch (err) {
      setFormError("Network connection error. Please retry.");
    } finally {
      setSavingType(null);
    }
  };

  const handleSetHighlightSkill = async (category: string, skillId: string) => {
    try {
      const res = await fetch("/api/admin/skills/highlight", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, skillId })
      });
      if (res.ok) {
        showToast("Category highlight updated.");
        await refreshPortfolio();
      }
    } catch (err) {
      showToast("Error updating highlight.");
    }
  };

  // -------------------------------------------------------------
  // PROJECTS HANDLERS
  // -------------------------------------------------------------
  const openNewProjectModal = () => {
    setEditingProject(null);
    setFormError(null);
    setProjectForm({
      title: "",
      subtitle: "",
      category: "AUTONOMOUS AGENTS",
      year: new Date().getFullYear().toString(),
      description: "",
      stack: "PYTHON, FASTAPI, DOCKER",
      github: "https://github.com/callsydeepu",
      visualType: "agents",
      accent: "yellow",
      featured: true
    });
    setProjectModalOpen(true);
  };

  const openEditProjectModal = (proj: FeaturedProject) => {
    setEditingProject(proj);
    setFormError(null);
    setProjectForm({
      title: proj.title,
      subtitle: proj.subtitle,
      category: proj.category,
      year: proj.year,
      description: proj.description,
      stack: Array.isArray(proj.stack) ? proj.stack.join(", ") : "",
      github: proj.github || "",
      visualType: proj.visualType || "agents",
      accent: proj.accent || "yellow",
      featured: true
    });
    setProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingType) return;

    if (!projectForm.title.trim()) {
      setFormError("Project title is required.");
      return;
    }
    if (!projectForm.description.trim() || projectForm.description.trim().length < 5) {
      setFormError("Project description must be at least 5 characters.");
      return;
    }

    setSavingType("project");
    setFormError(null);

    const stackArray = projectForm.stack
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    try {
      const url = editingProject
        ? `/api/admin/projects/${editingProject.id}`
        : "/api/admin/projects";
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectForm,
          stack: stackArray,
          number: editingProject?.number,
          metrics: editingProject?.metrics || []
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Failed to save project. Please check fields.");
        return;
      }

      await refreshPortfolio();
      await fetchOverview();
      setProjectModalOpen(false);
      showToast(editingProject ? "Project updated successfully." : "New project created.");
    } catch (err) {
      setFormError("Network error saving project.");
    } finally {
      setSavingType(null);
    }
  };

  const handleMoveProject = async (index: number, direction: "up" | "down") => {
    if (reordering) return; // Prevent conflicting reorder requests
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= projects.length) return;

    setReordering(true);
    try {
      const reordered = [...projects];
      const temp = reordered[index];
      reordered[index] = reordered[newIdx];
      reordered[newIdx] = temp;

      const projectIds = reordered.map((p) => p.id);
      const res = await fetch("/api/admin/projects/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectIds })
      });

      if (res.ok) {
        showToast("Project order updated.");
        await refreshPortfolio();
      } else {
        showToast("Failed to update project order on server.");
      }
    } catch (err) {
      showToast("Network error updating order.");
    } finally {
      setReordering(false);
    }
  };

  // -------------------------------------------------------------
  // BIO HANDLER
  // -------------------------------------------------------------
  const handleSaveBio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingType) return;

    setSavingType("bio");
    setFormError(null);

    try {
      const res = await fetch("/api/admin/bio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bioForm)
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Profile & Bio updated in database.");
        await refreshPortfolio();
      } else {
        setFormError(data.error || "Failed to update profile.");
        showToast("Error updating profile.");
      }
    } catch (err) {
      setFormError("Network error updating profile.");
      showToast("Network error updating bio.");
    } finally {
      setSavingType(null);
    }
  };

  // -------------------------------------------------------------
  // DELETION CONFIRMATION HANDLER
  // -------------------------------------------------------------
  const handleExecuteDelete = async () => {
    if (!deleteConfirm || deletingId) return;

    const { type, id, title } = deleteConfirm;
    setDeletingId(id);

    try {
      let endpoint = "";
      if (type === "cert") endpoint = `/api/admin/certifications/${id}`;
      else if (type === "skill") endpoint = `/api/admin/skills/${id}`;
      else if (type === "project") endpoint = `/api/admin/projects/${id}`;
      else if (type === "message") endpoint = `/api/admin/messages/${id}`;

      const res = await fetch(endpoint, { method: "DELETE" });

      if (res.ok) {
        showToast(`"${title}" deleted successfully.`);
        if (type === "message") {
          if (selectedMessage?.id === id) setSelectedMessage(null);
          await fetchMessages();
        } else {
          await refreshPortfolio();
        }
        await fetchOverview();
        setDeleteConfirm(null);
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to delete item.");
      }
    } catch (err) {
      showToast("Network error during deletion. Please retry.");
    } finally {
      setDeletingId(null);
    }
  };

  // -------------------------------------------------------------
  // MESSAGES HANDLERS
  // -------------------------------------------------------------
  const handleToggleMessageRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: currentRead ? 0 : 1 })
      });
      if (res.ok) {
        fetchMessages();
        fetchOverview();
      }
    } catch (err) {}
  };

  return (
    <div className="fixed inset-0 z-[150] bg-[#0a0a0c] text-white flex flex-col font-sans select-none overflow-hidden animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[200] bg-[#e2ee5a] text-[#0a0a0c] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xl border border-black/20 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR */}
      <header className="h-16 border-b border-white/10 bg-[#0e0e12] px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#e2ee5a] text-[#0a0a0c] flex items-center justify-center font-extrabold font-mono text-xs">
            CMS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-condensed font-extrabold text-lg uppercase tracking-tight text-white leading-none">
                SAI DEEPAK // CMS
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#e2ee5a] bg-[#e2ee5a]/10 px-1.5 py-0.5 border border-[#e2ee5a]/25">
                SQLITE LIVE
              </span>
            </div>
            <span className="font-mono text-[10px] text-zinc-400 block">
              PORTFOLIO CONTROL CENTER
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => refreshPortfolio()}
            title="Reload live data from database"
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">VIEW PUBLIC PORTFOLIO</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LOGOUT</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-56 sm:w-64 border-r border-white/10 bg-[#0e0e12] p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 px-3 py-1 block">
              MANAGEMENT MODULES
            </span>

            {[
              { id: "overview", label: "OVERVIEW", icon: LayoutDashboard },
              { id: "certifications", label: "CERTIFICATIONS", icon: Award },
              { id: "skills", label: "TECH STACK", icon: Cpu },
              { id: "projects", label: "PROJECTS", icon: FolderGit2 },
              { id: "bio", label: "BIO & ABOUT", icon: User },
              {
                id: "messages",
                label: "INBOX MESSAGES",
                icon: Inbox,
                badge: stats?.unreadMessages || 0
              }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-[#e2ee5a] text-[#0a0a0c] font-bold"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && tab.badge > 0 ? (
                    <span
                      className={`px-1.5 py-0.2 text-[10px] font-mono rounded-full ${
                        isActive
                          ? "bg-[#0a0a0c] text-[#e2ee5a]"
                          : "bg-[#e2ee5a] text-[#0a0a0c]"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 text-[10px] font-mono text-zinc-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ACTIVE SESSION VERIFIED</span>
            </div>
            <div>LOCAL DB: portfolio.db</div>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 bg-[#0a0a0c] p-4 sm:p-8 overflow-y-auto">
          {/* 1. OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
              <div>
                <span className="font-mono text-xs text-[#e2ee5a] tracking-widest uppercase block mb-1">
                  SYSTEM OVERVIEW // METRICS
                </span>
                <h1 className="font-condensed font-extrabold text-3xl sm:text-4xl uppercase text-white tracking-tight">
                  PORTFOLIO HEALTH & CONTENT
                </h1>
              </div>

              {/* STAT CARDS */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-[#141418] border border-white/10 p-4">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                    CERTIFICATIONS
                  </span>
                  <div className="font-condensed font-extrabold text-3xl sm:text-4xl text-[#e2ee5a]">
                    {stats?.certCount ?? certifications.length}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">Verified Records</span>
                </div>

                <div className="bg-[#141418] border border-white/10 p-4">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                    SKILLS & TECH
                  </span>
                  <div className="font-condensed font-extrabold text-3xl sm:text-4xl text-white">
                    {stats?.skillCount ?? rawSkills.length}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">6 Categories</span>
                </div>

                <div className="bg-[#141418] border border-white/10 p-4">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                    SHOWCASED PROJECTS
                  </span>
                  <div className="font-condensed font-extrabold text-3xl sm:text-4xl text-white">
                    {stats?.projectCount ?? projects.length}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">Case Files</span>
                </div>

                <div className="bg-[#141418] border border-white/10 p-4">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                    TOTAL INQUIRIES
                  </span>
                  <div className="font-condensed font-extrabold text-3xl sm:text-4xl text-white">
                    {stats?.totalMessages ?? messages.length}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">Form Submissions</span>
                </div>

                <div className="bg-[#141418] border border-white/10 p-4">
                  <span className="font-mono text-[10px] text-[#e2ee5a] uppercase tracking-wider block mb-1">
                    UNREAD MESSAGES
                  </span>
                  <div className="font-condensed font-extrabold text-3xl sm:text-4xl text-[#e2ee5a]">
                    {stats?.unreadMessages ?? 0}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">Awaiting Review</span>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="bg-[#141418] border border-white/10 p-6">
                <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider block mb-4">
                  QUICK CONTENT ACTIONS
                </span>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setActiveTab("certifications");
                      openNewCertModal();
                    }}
                    className="flex items-center gap-2 bg-[#e2ee5a] text-[#0a0a0c] font-condensed font-extrabold text-sm uppercase px-4 py-2 hover:bg-[#ecf85e] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD CERTIFICATION</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("skills");
                      openNewSkillModal();
                    }}
                    className="flex items-center gap-2 bg-white/10 text-white font-condensed font-extrabold text-sm uppercase px-4 py-2 hover:bg-white/20 border border-white/15 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD SKILL</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("projects");
                      openNewProjectModal();
                    }}
                    className="flex items-center gap-2 bg-white/10 text-white font-condensed font-extrabold text-sm uppercase px-4 py-2 hover:bg-white/20 border border-white/15 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD PROJECT</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("messages")}
                    className="flex items-center gap-2 bg-white/10 text-white font-condensed font-extrabold text-sm uppercase px-4 py-2 hover:bg-white/20 border border-white/15 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>VIEW INBOX ({stats?.unreadMessages ?? 0})</span>
                  </button>
                </div>
              </div>

              {/* RECENT MESSAGES */}
              <div className="bg-[#141418] border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider block">
                    RECENT INCOMING MESSAGES
                  </span>
                  <button
                    onClick={() => setActiveTab("messages")}
                    className="text-xs font-mono text-[#e2ee5a] hover:underline"
                  >
                    VIEW ALL INBOX →
                  </button>
                </div>

                {stats?.recentMessages && stats.recentMessages.length > 0 ? (
                  <div className="divide-y divide-white/10">
                    {stats.recentMessages.map((msg: any) => (
                      <div
                        key={msg.id}
                        className="py-3 flex items-center justify-between gap-4 hover:bg-white/5 px-2 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedMessage(msg);
                          setActiveTab("messages");
                        }}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-condensed font-bold text-sm text-white">
                              {msg.name}
                            </span>
                            <span className="font-mono text-[10px] text-zinc-400">
                              &lt;{msg.email}&gt;
                            </span>
                            {!msg.is_read && (
                              <span className="px-1.5 py-0.2 bg-[#e2ee5a] text-[#0a0a0c] font-mono text-[9px] font-bold uppercase">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 truncate max-w-md">
                            {msg.subject ? `${msg.subject}: ` : ""}
                            {msg.message}
                          </p>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-400 shrink-0">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 font-mono py-4">
                    No inquiries received yet. Visitors can submit messages via the public contact form.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 2. CERTIFICATIONS TAB */}
          {activeTab === "certifications" && (
            <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-[#e2ee5a] tracking-widest uppercase block mb-1">
                    CMS // CHAPTER 04
                  </span>
                  <h1 className="font-condensed font-extrabold text-3xl sm:text-4xl uppercase text-white tracking-tight">
                    CERTIFICATIONS MANAGEMENT
                  </h1>
                </div>

                <button
                  onClick={openNewCertModal}
                  className="flex items-center gap-2 bg-[#e2ee5a] text-[#0a0a0c] font-condensed font-extrabold text-sm uppercase px-4 py-2 hover:bg-[#ecf85e] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD CERTIFICATION</span>
                </button>
              </div>

              {/* TABLE */}
              <div className="bg-[#141418] border border-white/10 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 font-mono text-[10px] text-zinc-400 uppercase bg-[#0e0e12]">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">CERTIFICATION TITLE</th>
                      <th className="py-3 px-4">ISSUER</th>
                      <th className="py-3 px-4">YEAR</th>
                      <th className="py-3 px-4">CATEGORY</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-xs">
                    {certifications.map((cert, idx) => (
                      <tr key={cert.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-[#e2ee5a] font-bold">
                          {String(idx + 1).padStart(2, "0")}
                        </td>
                        <td className="py-3.5 px-4 font-condensed font-bold text-sm text-white max-w-xs">
                          {cert.title}
                          {cert.domain && (
                            <span className="block font-serif italic text-xs text-zinc-400 font-normal">
                              {cert.domain}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-zinc-300">{cert.issuer}</td>
                        <td className="py-3.5 px-4 font-mono text-zinc-400">{cert.year}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 font-mono text-[10px] bg-white/5 border border-white/15 text-zinc-300">
                            {cert.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[10px]">
                          {cert.highlight ? (
                            <span className="text-[#e2ee5a] flex items-center gap-1 font-semibold">
                              <Star className="w-3 h-3 fill-[#e2ee5a]" /> FEATURED
                            </span>
                          ) : (
                            <span className="text-zinc-400">VERIFIED</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditCertModal(cert)}
                              className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  isOpen: true,
                                  type: "cert",
                                  id: cert.id,
                                  title: cert.title
                                })
                              }
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-500/20"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. SKILLS TAB */}
          {activeTab === "skills" && (
            <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-[#e2ee5a] tracking-widest uppercase block mb-1">
                    CMS // CHAPTER 03
                  </span>
                  <h1 className="font-condensed font-extrabold text-3xl sm:text-4xl uppercase text-white tracking-tight">
                    TECH STACK & SKILLS MANAGEMENT
                  </h1>
                </div>

                <button
                  onClick={() => openNewSkillModal()}
                  className="flex items-center gap-2 bg-[#e2ee5a] text-[#0a0a0c] font-condensed font-extrabold text-sm uppercase px-4 py-2 hover:bg-[#ecf85e] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD SKILL</span>
                </button>
              </div>

              {/* SKILLS GROUPED BY CATEGORY */}
              {[
                "PROGRAMMING LANGUAGES",
                "AI & MACHINE LEARNING",
                "BACKEND & APIS",
                "DATABASES",
                "DATA ANALYSIS",
                "TOOLS & CLOUD"
              ].map((cat) => {
                const catSkills = rawSkills.filter((s) => s.category === cat);
                return (
                  <div key={cat} className="bg-[#141418] border border-white/10 p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest block">
                          CATEGORY //
                        </span>
                        <h3 className="font-condensed font-extrabold text-xl text-white uppercase tracking-tight">
                          {cat}
                        </h3>
                      </div>

                      <button
                        onClick={() => openNewSkillModal(cat)}
                        className="text-xs font-mono text-[#e2ee5a] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> ADD TO {cat}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {catSkills.map((skill) => (
                        <div
                          key={skill.id}
                          className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-mono transition-all ${
                            skill.is_highlight
                              ? "bg-[#e2ee5a] text-[#0a0a0c] border-[#e2ee5a] font-bold"
                              : "bg-[#0e0e12] text-zinc-300 border-white/15"
                          }`}
                        >
                          <span className="font-condensed font-bold text-sm">{skill.name}</span>

                          <div className="flex items-center gap-1 border-l border-current/20 pl-2">
                            {/* Toggle Highlight */}
                            <button
                              onClick={() => handleSetHighlightSkill(cat, skill.id)}
                              title={skill.is_highlight ? "Current Highlight" : "Set as Highlight"}
                              className={`p-1 hover:opacity-75 ${
                                skill.is_highlight ? "text-[#0a0a0c]" : "text-zinc-400 hover:text-[#e2ee5a]"
                              }`}
                            >
                              <Star
                                className={`w-3 h-3 ${
                                  skill.is_highlight ? "fill-[#0a0a0c]" : ""
                                }`}
                              />
                            </button>

                            <button
                              onClick={() => openEditSkillModal(skill)}
                              title="Edit"
                              className="p-1 hover:opacity-75"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  isOpen: true,
                                  type: "skill",
                                  id: skill.id,
                                  title: skill.name
                                })
                              }
                              title="Delete"
                              className="p-1 hover:text-red-500"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. PROJECTS TAB */}
          {activeTab === "projects" && (
            <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-[#e2ee5a] tracking-widest uppercase block mb-1">
                    CMS // CHAPTER 02
                  </span>
                  <h1 className="font-condensed font-extrabold text-3xl sm:text-4xl uppercase text-white tracking-tight">
                    PROJECTS & CASE FILES
                  </h1>
                </div>

                <button
                  onClick={openNewProjectModal}
                  className="flex items-center gap-2 bg-[#e2ee5a] text-[#0a0a0c] font-condensed font-extrabold text-sm uppercase px-4 py-2 hover:bg-[#ecf85e] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD PROJECT</span>
                </button>
              </div>

              {/* PROJECTS LIST WITH ORDERING */}
              <div className="space-y-4">
                {projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="bg-[#141418] border border-white/10 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Order Controls */}
                      <div className="flex flex-col items-center justify-center gap-1 shrink-0 pt-1">
                        <button
                          disabled={idx === 0 || reordering}
                          onClick={() => handleMoveProject(idx, "up")}
                          className="p-1 text-zinc-400 hover:text-white disabled:opacity-20 border border-white/10 transition-opacity"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold text-[#e2ee5a]">
                          {proj.number || String(idx + 1).padStart(2, "0")}
                        </span>
                        <button
                          disabled={idx === projects.length - 1 || reordering}
                          onClick={() => handleMoveProject(idx, "down")}
                          className="p-1 text-zinc-400 hover:text-white disabled:opacity-20 border border-white/10 transition-opacity"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-condensed font-extrabold text-2xl text-white uppercase tracking-tight">
                            {proj.title}
                          </span>
                          <span className="px-2 py-0.5 font-mono text-[9px] uppercase bg-white/5 border border-white/15 text-[#e2ee5a]">
                            {proj.category}
                          </span>
                          <span className="font-mono text-xs text-zinc-400">{proj.year}</span>
                        </div>

                        {proj.subtitle && (
                          <div className="font-serif italic text-xs text-zinc-300">
                            {proj.subtitle}
                          </div>
                        )}

                        <p className="text-xs text-zinc-400 max-w-2xl line-clamp-2">
                          {proj.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.stack?.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="font-mono text-[9px] bg-black/40 text-zinc-400 px-1.5 py-0.5 border border-white/10"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => openEditProjectModal(proj)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono uppercase bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            isOpen: true,
                            type: "project",
                            id: proj.id,
                            title: proj.title
                          })
                        }
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono uppercase bg-red-950/30 hover:bg-red-950/60 border border-red-500/20 text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. BIO & ABOUT TAB */}
          {activeTab === "bio" && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <div>
                <span className="font-mono text-xs text-[#e2ee5a] tracking-widest uppercase block mb-1">
                  CMS // PROFILE & BRANDING
                </span>
                <h1 className="font-condensed font-extrabold text-3xl sm:text-4xl uppercase text-white tracking-tight">
                  BIO, HEADLINE & METADATA
                </h1>
              </div>

              {formError && (
                <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveBio} className="bg-[#141418] border border-white/10 p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      disabled={savingType === "bio"}
                      value={bioForm.name || ""}
                      onChange={(e) => setBioForm({ ...bioForm, name: e.target.value })}
                      className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                      DISPLAY SURNAME (HERO WATERMARK)
                    </label>
                    <input
                      type="text"
                      disabled={savingType === "bio"}
                      value={bioForm.displaySurname || ""}
                      onChange={(e) => setBioForm({ ...bioForm, displaySurname: e.target.value })}
                      className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                    PRIMARY ROLE / POSITIONING
                  </label>
                  <input
                    type="text"
                    disabled={savingType === "bio"}
                    value={bioForm.positioning || ""}
                    onChange={(e) => setBioForm({ ...bioForm, positioning: e.target.value })}
                    className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                    HERO STATEMENT / TAGLINE
                  </label>
                  <textarea
                    rows={2}
                    disabled={savingType === "bio"}
                    value={bioForm.role || ""}
                    onChange={(e) => setBioForm({ ...bioForm, role: e.target.value })}
                    className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-sans focus:border-[#e2ee5a] focus:outline-none disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                    ABOUT ME SUMMARY
                  </label>
                  <textarea
                    rows={4}
                    disabled={savingType === "bio"}
                    value={bioForm.summary || ""}
                    onChange={(e) => setBioForm({ ...bioForm, summary: e.target.value })}
                    className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-sans focus:border-[#e2ee5a] focus:outline-none disabled:opacity-60"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                      LOCATION
                    </label>
                    <input
                      type="text"
                      disabled={savingType === "bio"}
                      value={bioForm.location || ""}
                      onChange={(e) => setBioForm({ ...bioForm, location: e.target.value })}
                      className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                      CONTACT EMAIL
                    </label>
                    <input
                      type="email"
                      disabled={savingType === "bio"}
                      value={bioForm.email || ""}
                      onChange={(e) => setBioForm({ ...bioForm, email: e.target.value })}
                      className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                      GITHUB URL
                    </label>
                    <input
                      type="text"
                      disabled={savingType === "bio"}
                      value={bioForm.github || ""}
                      onChange={(e) => setBioForm({ ...bioForm, github: e.target.value })}
                      className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                      LINKEDIN URL
                    </label>
                    <input
                      type="text"
                      disabled={savingType === "bio"}
                      value={bioForm.linkedin || ""}
                      onChange={(e) => setBioForm({ ...bioForm, linkedin: e.target.value })}
                      className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                      CURRENT STATUS
                    </label>
                    <input
                      type="text"
                      disabled={savingType === "bio"}
                      value={bioForm.status || ""}
                      onChange={(e) => setBioForm({ ...bioForm, status: e.target.value })}
                      className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingType === "bio"}
                    className="flex items-center gap-2 bg-[#e2ee5a] text-[#0a0a0c] font-condensed font-extrabold text-sm uppercase px-6 py-2.5 hover:bg-[#ecf85e] disabled:opacity-50 transition-colors"
                  >
                    {savingType === "bio" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>SAVING CHANGES...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>SAVE PROFILE CHANGES</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 6. MESSAGES TAB */}
          {activeTab === "messages" && (
            <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-[#e2ee5a] tracking-widest uppercase block mb-1">
                    CMS // INBOX
                  </span>
                  <h1 className="font-condensed font-extrabold text-3xl sm:text-4xl uppercase text-white tracking-tight">
                    INCOMING MESSAGES ({messages.length})
                  </h1>
                </div>

                <button
                  onClick={fetchMessages}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* List Column */}
                <div className="lg:col-span-5 bg-[#141418] border border-white/10 divide-y divide-white/10 max-h-[650px] overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="p-8 text-center text-zinc-400 font-mono text-xs">
                      No inquiries in inbox.
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => {
                          setSelectedMessage(msg);
                          if (!msg.is_read) {
                            handleToggleMessageRead(msg.id, false);
                          }
                        }}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedMessage?.id === msg.id
                            ? "bg-white/10"
                            : !msg.is_read
                            ? "bg-[#18181f] hover:bg-white/5"
                            : "hover:bg-white/5 opacity-80"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-condensed font-bold text-sm text-white">
                            {msg.name}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-400">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-[#e2ee5a] truncate mb-1">
                          {msg.subject || "General Inquiry"}
                        </div>
                        <p className="text-xs text-zinc-400 truncate">{msg.message}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Details Column */}
                <div className="lg:col-span-7 bg-[#141418] border border-white/10 p-6 min-h-[300px]">
                  {selectedMessage ? (
                    <div className="space-y-6">
                      <div className="flex items-start justify-between border-b border-white/10 pb-4">
                        <div>
                          <div className="font-mono text-xs text-[#e2ee5a] mb-1">
                            {selectedMessage.subject || "No Subject"}
                          </div>
                          <h2 className="font-condensed font-extrabold text-2xl text-white">
                            {selectedMessage.name}
                          </h2>
                          <a
                            href={`mailto:${selectedMessage.email}`}
                            className="font-mono text-xs text-zinc-400 hover:text-white underline mt-0.5 inline-block"
                          >
                            {selectedMessage.email}
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleToggleMessageRead(
                                selectedMessage.id,
                                !!selectedMessage.is_read
                              )
                            }
                            className="px-2.5 py-1 text-[11px] font-mono border border-white/15 hover:bg-white/10"
                          >
                            {selectedMessage.is_read ? "Mark Unread" : "Mark Read"}
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                isOpen: true,
                                type: "message",
                                id: selectedMessage.id,
                                title: `Message from ${selectedMessage.name}`
                              })
                            }
                            className="p-1.5 text-red-400 hover:text-red-300 border border-red-500/20 hover:bg-red-950/40"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest block mb-2">
                          MESSAGE BODY:
                        </span>
                        <div className="bg-[#0e0e12] border border-white/10 p-4 text-sm text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed">
                          {selectedMessage.message}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-4 border-t border-white/10">
                        <span>RECEIVED: {new Date(selectedMessage.created_at).toLocaleString()}</span>
                        <a
                          href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                            selectedMessage.subject || "Portfolio Inquiry"
                          )}`}
                          className="bg-[#e2ee5a] text-[#0a0a0c] px-4 py-1.5 font-bold uppercase font-condensed tracking-wider hover:bg-[#ecf85e]"
                        >
                          REPLY VIA EMAIL ↗
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-400 font-mono text-xs">
                      <Mail className="w-10 h-10 text-zinc-600 mb-2" />
                      Select a message to view transmission details.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* IN-APP DELETE CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {deleteConfirm && deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0e0e12] border border-red-500/30 p-6 shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-red-400 font-semibold block">
                  CONFIRM ACTION
                </span>
                <h3 className="font-condensed font-extrabold text-2xl uppercase tracking-tight text-white leading-none">
                  DELETE PERMANENTLY?
                </h3>
              </div>
            </div>

            <p className="text-zinc-300 text-xs sm:text-sm font-sans mb-6 leading-relaxed">
              Are you sure you want to delete <strong className="text-white font-bold">"{deleteConfirm.title}"</strong>?
              This record will be permanently removed from your SQLite database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                disabled={!!deletingId}
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white border border-white/10 hover:border-white/25 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!!deletingId}
                onClick={handleExecuteDelete}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-condensed font-extrabold text-sm uppercase px-5 py-2 disabled:opacity-50 transition-colors"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>DELETING...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>CONFIRM DELETE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CERTIFICATION MODAL (ADD / EDIT) */}
      {/* ------------------------------------------------------------- */}
      {certModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0e0e12] border border-white/15 p-6 shadow-2xl">
            <button
              onClick={() => {
                if (!savingType) setCertModalOpen(false);
              }}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-condensed font-extrabold text-2xl uppercase text-white mb-4">
              {editingCert ? "EDIT CERTIFICATION" : "ADD NEW CERTIFICATION"}
            </h3>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5 mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCert} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                  TITLE *
                </label>
                <input
                  type="text"
                  required
                  disabled={savingType === "cert"}
                  value={certForm.title}
                  onChange={(e) => {
                    setCertForm({ ...certForm, title: e.target.value });
                    if (formError) setFormError(null);
                  }}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                    ISSUER *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={savingType === "cert"}
                    value={certForm.issuer}
                    onChange={(e) => {
                      setCertForm({ ...certForm, issuer: e.target.value });
                      if (formError) setFormError(null);
                    }}
                    placeholder="e.g. Oracle / AWS"
                    className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                    YEAR *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={savingType === "cert"}
                    value={certForm.year}
                    onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
                    placeholder="2025"
                    className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                    CATEGORY *
                  </label>
                  <select
                    disabled={savingType === "cert"}
                    value={certForm.category}
                    onChange={(e) => setCertForm({ ...certForm, category: e.target.value })}
                    className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-50"
                  >
                    <option value="AI / ML">AI / ML</option>
                    <option value="CLOUD">CLOUD</option>
                    <option value="DATA">DATA</option>
                    <option value="BACKEND">BACKEND</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                    DOMAIN / SUBTITLE
                  </label>
                  <input
                    type="text"
                    disabled={savingType === "cert"}
                    value={certForm.domain}
                    onChange={(e) => setCertForm({ ...certForm, domain: e.target.value })}
                    placeholder="e.g. Distributed Systems"
                    className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                  VERIFICATION / CREDENTIAL URL (OPTIONAL)
                </label>
                <input
                  type="url"
                  disabled={savingType === "cert"}
                  value={certForm.link}
                  onChange={(e) => setCertForm({ ...certForm, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-50"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="certHighlight"
                  disabled={savingType === "cert"}
                  checked={certForm.highlight}
                  onChange={(e) => setCertForm({ ...certForm, highlight: e.target.checked })}
                  className="w-4 h-4 accent-[#e2ee5a]"
                />
                <label htmlFor="certHighlight" className="font-mono text-xs text-zinc-300">
                  Highlight as Featured Credential
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={savingType === "cert"}
                  onClick={() => setCertModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono uppercase text-zinc-400 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingType === "cert"}
                  className="flex items-center gap-2 bg-[#e2ee5a] text-[#0a0a0c] font-condensed font-extrabold text-sm uppercase px-5 py-2 hover:bg-[#ecf85e] disabled:opacity-50 transition-colors"
                >
                  {savingType === "cert" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{editingCert ? "UPDATING..." : "SAVING..."}</span>
                    </>
                  ) : (
                    <span>{editingCert ? "UPDATE CERTIFICATION" : "SAVE CERTIFICATION"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SKILL MODAL (ADD / EDIT) */}
      {/* ------------------------------------------------------------- */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0e0e12] border border-white/15 p-6 shadow-2xl">
            <button
              onClick={() => {
                if (!savingType) setSkillModalOpen(false);
              }}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-condensed font-extrabold text-2xl uppercase text-white mb-4">
              {editingSkill ? "EDIT SKILL" : "ADD SKILL"}
            </h3>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5 mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                  SKILL NAME *
                </label>
                <input
                  type="text"
                  required
                  disabled={savingType === "skill"}
                  value={skillForm.name}
                  onChange={(e) => {
                    setSkillForm({ ...skillForm, name: e.target.value });
                    if (formError) setFormError(null);
                  }}
                  placeholder="e.g. PYTORCH"
                  className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono uppercase focus:border-[#e2ee5a] focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                  CATEGORY *
                </label>
                <select
                  disabled={savingType === "skill"}
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-50"
                >
                  <option value="PROGRAMMING LANGUAGES">PROGRAMMING LANGUAGES</option>
                  <option value="AI & MACHINE LEARNING">AI & MACHINE LEARNING</option>
                  <option value="BACKEND & APIS">BACKEND & APIS</option>
                  <option value="DATABASES">DATABASES</option>
                  <option value="DATA ANALYSIS">DATA ANALYSIS</option>
                  <option value="TOOLS & CLOUD">TOOLS & CLOUD</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="skillHighlight"
                  disabled={savingType === "skill"}
                  checked={skillForm.is_highlight}
                  onChange={(e) => setSkillForm({ ...skillForm, is_highlight: e.target.checked })}
                  className="w-4 h-4 accent-[#e2ee5a]"
                />
                <label htmlFor="skillHighlight" className="font-mono text-xs text-zinc-300">
                  Highlight with Yellow Accent
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={savingType === "skill"}
                  onClick={() => setSkillModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono uppercase text-zinc-400 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingType === "skill"}
                  className="flex items-center gap-2 bg-[#e2ee5a] text-[#0a0a0c] font-condensed font-extrabold text-sm uppercase px-5 py-2 hover:bg-[#ecf85e] disabled:opacity-50 transition-colors"
                >
                  {savingType === "skill" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>SAVING...</span>
                    </>
                  ) : (
                    <span>{editingSkill ? "UPDATE SKILL" : "SAVE SKILL"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PROJECT MODAL (ADD / EDIT) */}
      {/* ------------------------------------------------------------- */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0e0e12] border border-white/15 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                if (!savingType) setProjectModalOpen(false);
              }}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-condensed font-extrabold text-2xl uppercase text-white mb-4">
              {editingProject ? "EDIT PROJECT" : "ADD NEW PROJECT"}
            </h3>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5 mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                  PROJECT TITLE *
                </label>
                <input
                  type="text"
                  required
                  disabled={savingType === "project"}
                  value={projectForm.title}
                  onChange={(e) => {
                    setProjectForm({ ...projectForm, title: e.target.value });
                    if (formError) setFormError(null);
                  }}
                  placeholder="e.g. AGENTSPACE"
                  className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono uppercase focus:border-[#e2ee5a] focus:outline-none disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                    CATEGORY *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={savingType === "project"}
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    placeholder="e.g. AUTONOMOUS AGENTS"
                    className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono uppercase focus:border-[#e2ee5a] focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                    YEAR *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={savingType === "project"}
                    value={projectForm.year}
                    onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                    placeholder="2026"
                    className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                  SUBTITLE / FOCUS
                </label>
                <input
                  type="text"
                  disabled={savingType === "project"}
                  value={projectForm.subtitle}
                  onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                  placeholder="e.g. Multi-Agent AI Platform & Microservices Orchestration"
                  className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                  DESCRIPTION *
                </label>
                <textarea
                  rows={3}
                  required
                  disabled={savingType === "project"}
                  value={projectForm.description}
                  onChange={(e) => {
                    setProjectForm({ ...projectForm, description: e.target.value });
                    if (formError) setFormError(null);
                  }}
                  placeholder="Comprehensive technical breakdown of architecture, models, and latency improvements..."
                  className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-sans focus:border-[#e2ee5a] focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                  TECH STACK (COMMA-SEPARATED) *
                </label>
                <input
                  type="text"
                  required
                  disabled={savingType === "project"}
                  value={projectForm.stack}
                  onChange={(e) => setProjectForm({ ...projectForm, stack: e.target.value })}
                  placeholder="PYTHON, LANGCHAIN, FASTAPI, DOCKER"
                  className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                  GITHUB REPOSITORY URL
                </label>
                <input
                  type="url"
                  disabled={savingType === "project"}
                  value={projectForm.github}
                  onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ee5a] focus:outline-none disabled:opacity-50"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={savingType === "project"}
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono uppercase text-zinc-400 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingType === "project"}
                  className="flex items-center gap-2 bg-[#e2ee5a] text-[#0a0a0c] font-condensed font-extrabold text-sm uppercase px-5 py-2 hover:bg-[#ecf85e] disabled:opacity-50 transition-colors"
                >
                  {savingType === "project" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>SAVING...</span>
                    </>
                  ) : (
                    <span>{editingProject ? "UPDATE PROJECT" : "SAVE PROJECT"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
