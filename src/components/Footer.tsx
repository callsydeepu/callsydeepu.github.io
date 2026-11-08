import React from "react";
import { ArrowUp, Github, Linkedin, Mail, Phone, ExternalLink } from "lucide-react";
import { profile } from "../data";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-ink-950 text-ivory-300 border-t border-white/10 pt-16 pb-12 font-mono">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Colophon & Identity (6 cols) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2 text-accent-yellow text-xs tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-accent-yellow" />
              <span>COLOPHON & ARCHIVE NOTICE</span>
            </div>
            <h3 className="text-2xl font-display font-extrabold text-white">
              {profile.name}
            </h3>
            <p className="text-xs text-ivory-400 font-sans leading-relaxed max-w-md">
              AI Engineer with hands-on experience in LLM orchestration, RAG architectures, and microservice engineering. Undergraduate at Parul University, Vadodara (2023–2027).
            </p>
            <div className="text-[11px] text-ivory-400 space-y-1 pt-2">
              <div>LOCATION: Vadodara, Gujarat, India • 22.3072° N, 73.1812° E</div>
              <div>ACADEMIC STANDING: B.Tech CSE (AI) • CGPA 8.79 / 10.0</div>
            </div>
          </div>

          {/* Quick Verified Channels (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs text-white font-bold tracking-wider block">
              VERIFIED CHANNELS
            </span>
            <ul className="space-y-2 text-xs text-ivory-400">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="hover:text-accent-yellow transition-colors flex items-center gap-2"
                >
                  <Mail size={13} />
                  <span>{profile.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${profile.phone}`}
                  className="hover:text-accent-yellow transition-colors flex items-center gap-2"
                >
                  <Phone size={13} />
                  <span>{profile.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent-yellow transition-colors flex items-center gap-2"
                >
                  <Linkedin size={13} />
                  <span>LinkedIn Profile</span>
                </a>
              </li>
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent-yellow transition-colors flex items-center gap-2"
                >
                  <Github size={13} />
                  <span>GitHub Repositories</span>
                </a>
              </li>
              <li>
                <a
                  href={profile.leetcode}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent-yellow transition-colors flex items-center gap-2"
                >
                  <span className="text-xs font-bold text-accent-yellow">LC</span>
                  <span>LeetCode Algorithms</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Chapters & Index (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs text-white font-bold tracking-wider block">
              DOSSIER CHAPTERS
            </span>
            <ul className="space-y-2 text-xs text-ivory-400">
              <li>
                <a href="#home" className="hover:text-accent-yellow transition-colors">
                  00. Opening & Portrait
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-accent-yellow transition-colors">
                  01. Investigation & Blueprint
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-accent-yellow transition-colors">
                  02. Field Case Studies
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-accent-yellow transition-colors">
                  03. Technical Specifications
                </a>
              </li>
              <li>
                <a href="#collaborate" className="hover:text-accent-yellow transition-colors">
                  04. Collaboration Protocol
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory-400/80">
          <div>
            © {new Date().getFullYear()} {profile.name}. Editorial Portfolio inspired by investigative visual storytelling.
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-accent-yellow transition-colors cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}

