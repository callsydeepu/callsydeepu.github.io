import React from "react";
import { PortfolioProvider } from "./context/PortfolioContext";
import { Navbar } from "./components/Navbar";
import { HeroSubject } from "./components/HeroSubject";
import { ChapterSubject } from "./components/ChapterSubject";
import { ChapterCaseFiles } from "./components/ChapterCaseFiles";
import { ChapterToolkit } from "./components/ChapterToolkit";
import { ChapterCertifications } from "./components/ChapterCertifications";
import { ChapterJourney } from "./components/ChapterJourney";
import { ChapterHireMe } from "./components/ChapterHireMe";
import { AdminLoginModal } from "./components/admin/AdminLoginModal";
import { AdminDashboard } from "./components/admin/AdminDashboard";

export default function App() {
  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-[#0a0a0c] text-ivory-100 relative selection:bg-[#e2ee5a] selection:text-[#0a0a0c]">
        {/* Film Grain Texture Overlay */}
        <div className="editorial-noise" aria-hidden="true" />

        {/* Top Bar: A PORTFOLIO IN SIX CHAPTERS */}
        <Navbar />

        <main>
          {/* 01. HERO / THE SUBJECT (With Torchlight Reveal & Outlined AMBATI) */}
          <HeroSubject />

          {/* 02. CH. 01 — THE SUBJECT (STUDYING HOW MACHINES LEARN. Building the systems they run on.) */}
          <ChapterSubject />

          {/* 03. CH. 02 — CASE FILES (SELECTED SYSTEMS) */}
          <ChapterCaseFiles />

          {/* 04. CH. 03 — TOOLKIT (Kinetic Typographic Arsenals with Tape Tags) */}
          <ChapterToolkit />

          {/* 05. CH. 04 — CERTIFICATIONS (Verified Industry Accreditations & Credentials) */}
          <ChapterCertifications />

          {/* 06. CH. 05 — MY JOURNEY (Cinematic Education Timeline) */}
          <ChapterJourney />

          {/* 07. CH. 06 — HIRE ME (PULL ME INTO your team., Suited Arm & Hand, Floating Kinetic Words, Pill Button) */}
          <ChapterHireMe />
        </main>

        {/* Admin CMS Portals */}
        <AdminLoginModal />
        <AdminDashboard />
      </div>
    </PortfolioProvider>
  );
}
