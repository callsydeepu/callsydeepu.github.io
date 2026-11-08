import React, { useState } from "react";
import { Send, X, CheckCircle, Mail, AlertCircle } from "lucide-react";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [hpWebsite, setHpWebsite] = useState(""); // Honeypot field for bot protection

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          hp_website: hpWebsite
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to deliver message. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError("Network error. Please try again or reach out via email directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0e0e11] border border-white/15 p-6 sm:p-8 shadow-2xl text-white select-none">
        {/* Close Button */}
        <button
          onClick={resetForm}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-[#e2ee5a] text-[#0a0a0c] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="font-condensed font-extrabold text-2xl uppercase tracking-tight text-white mb-2">
              MESSAGE DELIVERED
            </h3>
            <p className="text-zinc-400 text-sm font-sans max-w-sm mx-auto mb-6">
              Thank you for reaching out. Your message has been saved in Sai Deepak's inbox, and he will reply to your email soon.
            </p>
            <button
              onClick={resetForm}
              className="bg-[#e2ee5a] text-[#0a0a0c] font-condensed font-extrabold text-sm uppercase tracking-wider px-6 py-2.5 hover:bg-[#ecf85e] transition-colors"
            >
              DONE
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-[#e2ee5a] text-[#0a0a0c] flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#e2ee5a] font-semibold block">
                  INBOX // DIRECT TRANSMISSION
                </span>
                <h2 className="font-condensed font-extrabold text-2xl uppercase tracking-tight text-white leading-none">
                  SEND A MESSAGE
                </h2>
              </div>
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm font-sans mb-5 leading-relaxed">
              Have an AI project, collaboration, or full-time opportunity in mind? Send a direct message and it will land in my private admin inbox.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Bot Honeypot (hidden from humans) */}
              <input
                type="text"
                name="hp_website"
                value={hpWebsite}
                onChange={(e) => setHpWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#e2ee5a] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#e2ee5a] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                  SUBJECT
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Project Collaboration / AI Engineering"
                  className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#e2ee5a] transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                  MESSAGE DETAILS *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about what you want to build or discuss..."
                  className="w-full bg-[#18181c] border border-white/20 text-white px-3 py-2 text-xs font-sans placeholder:text-zinc-600 focus:outline-none focus:border-[#e2ee5a] transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white border border-white/10 hover:border-white/25 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#e2ee5a] text-[#0a0a0c] font-condensed font-extrabold text-sm uppercase tracking-wider py-2.5 px-5 hover:bg-[#ecf85e] disabled:opacity-50 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "TRANSMITTING..." : "SEND MESSAGE ↗"}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

