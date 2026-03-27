"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


/* ─── Input mode tabs ─── */
const MODES = ["repo-url", "manual"] as const;
type Mode = (typeof MODES)[number];

export default function Page() {
  const [repoUrl, setRepoUrl] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("repo-url");
  const [manualDetails, setManualDetails] = useState("");
  const [previewTab, setPreviewTab] = useState<"preview" | "raw">("preview");
  const [inputFocused, setInputFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCharCount(repoUrl.length + manualDetails.length);
  }, [repoUrl, manualDetails]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, options: { showBanner: true } }),
      });
      const data = await res.json();
      setMarkdown(data.readme);
    } catch {
      setMarkdown("# Error\n\nFailed to generate README. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "var(--surface-1)" }}>

      {/* ── Background effects ── */}
      <div className="grid-overlay" />
      <div className="scanline" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Nav ── */}
        <nav className="flex items-center justify-between px-8 py-5 slide-up">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <line x1="10" y1="9" x2="8" y2="9"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
              GIT<span style={{ color: "#a855f7" }}>.SCRIBE</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="status-dot" />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
                API ONLINE
              </span>
            </div>
            <div className="neon-badge">v2.0</div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <div className="text-center pt-12 pb-10 px-6 slide-up slide-up-delay-1">
          <div className="inline-flex items-center gap-2 mb-5 neon-badge">
            <span style={{ color: "#4ade80" }}>✦</span>
            AI-POWERED README GENERATION
          </div>
          <h1 className="heading-gradient" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 3.8rem)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1.2rem" }}>
            Beautiful READMEs,<br />Generated Instantly
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
            Paste a GitHub URL and get a professionally crafted README in seconds. Powered by Claude.
          </p>
        </div>

        {/* ── Main two-column layout ── */}
        <div className="flex-1 px-6 pb-16 max-w-7xl mx-auto w-full">
          <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>

            {/* ─── INPUT PANEL ─── */}
            <div className="slide-up slide-up-delay-2">
              <div className={`glass rounded-2xl p-6 relative overflow-hidden ${inputFocused ? "glass-active" : ""}`} style={{ transition: "all 0.3s ease" }}>
                {/* Corner accents */}
                <div className="corner-accent corner-tl" />
                <div className="corner-accent corner-tr" />
                <div className="corner-accent corner-bl" />
                <div className="corner-accent corner-br" />

                {/* Panel header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: "#f43f5e", boxShadow: "0 0 6px #f43f5e" }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: "#fbbf24", boxShadow: "0 0 6px #fbbf24" }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: "6px", letterSpacing: "0.05em" }}>
                      INPUT.tsx
                    </span>
                  </div>
                  {/* Mode tabs */}
                  <div className="flex gap-1" style={{ background: "rgba(0,0,0,0.3)", borderRadius: "10px", padding: "3px" }}>
                    <button
                      className={`tab-btn ${mode === "repo-url" ? "active" : ""}`}
                      onClick={() => setMode("repo-url")}
                    >url</button>
                    <button
                      className={`tab-btn ${mode === "manual" ? "active" : ""}`}
                      onClick={() => setMode("manual")}
                    >manual</button>
                  </div>
                </div>

                {/* ── Mode: Repo URL ── */}
                {mode === "repo-url" && (
                  <div className="space-y-3">
                    <label style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                      GitHub Repository URL
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                      </div>
                      <input
                        ref={inputRef}
                        type="url"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        placeholder="https://github.com/owner/repository"
                        className="neon-input w-full rounded-xl py-3 pr-4 pl-10"
                        style={{ height: "48px" }}
                      />
                    </div>

                    {/* Quick suggestions */}
                    <div className="flex flex-wrap gap-2 mt-1">
                      {["vercel/next.js", "facebook/react", "tailwindlabs/tailwindcss"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setRepoUrl(`https://github.com/${s}`)}
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.68rem",
                            color: "var(--text-muted)",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "6px",
                            padding: "3px 10px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.color = "#c084fc";
                            (e.target as HTMLElement).style.borderColor = "rgba(168,85,247,0.3)";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.color = "var(--text-muted)";
                            (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Mode: Manual ── */}
                {mode === "manual" && (
                  <div>
                    <label style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                      Project Details
                    </label>
                    <textarea
                      value={manualDetails}
                      onChange={(e) => setManualDetails(e.target.value)}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      placeholder={`Project name: My Awesome Tool\nDescription: A CLI tool that...\nFeatures: authentication, dark mode...\nStack: Next.js, TypeScript, Prisma`}
                      className="code-textarea neon-input rounded-xl p-4"
                      style={{ minHeight: "120px" }}
                    />
                    <div style={{ textAlign: "right", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      {charCount} chars
                    </div>
                  </div>
                )}

                {/* ── Options ── */}
                <div className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "12px" }}>
                    Options
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Badges", key: "badges", default: true },
                      { label: "License", key: "license", default: true },
                      { label: "Contributing", key: "contributing", default: false },
                      { label: "Roadmap", key: "roadmap", default: false },
                    ].map((opt) => (
                      <label key={opt.key} className="flex items-center gap-2.5 cursor-pointer group" style={{ padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <div style={{
                          width: "14px", height: "14px", borderRadius: "4px",
                          background: opt.default ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.05)",
                          border: `1px solid ${opt.default ? "rgba(168,85,247,0.8)" : "rgba(255,255,255,0.1)"}`,
                          flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          {opt.default && <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><polyline points="2,6 5,9 10,3"/></svg>}
                        </div>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "var(--text-secondary)" }}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ── Generate button ── */}
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="btn-generate w-full rounded-xl mt-5 flex items-center justify-center gap-3"
                  style={{ height: "50px", color: "white", opacity: loading ? 0.85 : 1 }}
                >
                  {loading ? (
                    <>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", letterSpacing: "0.08em" }}>GENERATING</span>
                      <div className="flex gap-1.5">
                        <span className="loading-dot" />
                        <span className="loading-dot" />
                        <span className="loading-dot" />
                      </div>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                      </svg>
                      <span>Generate README</span>
                    </>
                  )}
                </button>

                {/* ── Shimmer overlay while loading ── */}
                {loading && (
                  <div className="shimmer absolute inset-0 rounded-2xl pointer-events-none" style={{ opacity: 0.5 }} />
                )}
              </div>

              {/* ── Info strip ── */}
              <div className="flex items-center justify-between mt-3 px-1">
                {[
                  { icon: "⚡", text: "~8s generation" },
                  { icon: "🔒", text: "No data stored" },
                  { icon: "✦", text: "Markdown export" },
                ].map((item) => (
                  <span key={item.text} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                    {item.icon} {item.text}
                  </span>
                ))}
              </div>
            </div>

            {/* ─── PREVIEW PANEL ─── */}
            <div className="slide-up slide-up-delay-3">
              <div className="glass rounded-2xl relative overflow-hidden" style={{ height: "100%", minHeight: "520px", display: "flex", flexDirection: "column" }}>

                {/* Preview header */}
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
                  <div className="flex items-center gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    </svg>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                      README.md
                    </span>
                    {markdown && (
                      <span className="neon-badge" style={{ fontSize: "0.62rem" }}>
                        {Math.ceil(markdown.length / 5)} words
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Preview / Raw tabs */}
                    <div className="flex gap-1" style={{ background: "rgba(0,0,0,0.3)", borderRadius: "10px", padding: "3px" }}>
                      <button className={`tab-btn ${previewTab === "preview" ? "active" : ""}`} onClick={() => setPreviewTab("preview")}>preview</button>
                      <button className={`tab-btn ${previewTab === "raw" ? "active" : ""}`} onClick={() => setPreviewTab("raw")}>raw</button>
                    </div>

                    {/* Copy button */}
                    {markdown && (
                      <button
                        onClick={() => navigator.clipboard.writeText(markdown)}
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: "8px",
                          padding: "5px 10px",
                          cursor: "pointer",
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.68rem",
                          color: "var(--text-secondary)",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
                      >
                        copy
                      </button>
                    )}
                  </div>
                </div>

                {/* Preview body */}
                <div className="flex-1 overflow-y-auto" style={{ padding: "1.5rem" }}>
                  {loading ? (
                    /* Skeleton */
                    <div className="space-y-4">
                      {[80, 50, 100, 65, 90, 45, 75, 55, 85].map((w, i) => (
                        <div
                          key={i}
                          className="shimmer rounded"
                          style={{
                            height: i === 0 ? "28px" : i === 3 ? "20px" : "14px",
                            width: `${w}%`,
                            marginTop: i === 3 ? "2rem" : undefined,
                          }}
                        />
                      ))}
                    </div>
                  ) : markdown ? (
                    previewTab === "preview" ? (
                      <div className="gh-preview">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {markdown}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <pre className="code-textarea" style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.78rem", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {markdown}
                      </pre>
                    )
                  ) : (
                    /* Empty state */
                    <div className="empty-glow flex flex-col items-center justify-center h-full text-center py-16" style={{ gap: "16px" }}>
                      <div style={{
                        width: "64px", height: "64px", borderRadius: "16px",
                        background: "rgba(168,85,247,0.08)",
                        border: "1px solid rgba(168,85,247,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                          <polyline points="14,2 14,8 20,8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "6px" }}>
                          Preview will appear here
                        </p>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          Paste a GitHub URL → Generate
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Feature strip ── */}
          <div className="mt-8 slide-up slide-up-delay-4">
            <div className="glow-divider mb-8" style={{ maxWidth: "100%" }} />
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: "⚙️", title: "Repo Parsing", desc: "Reads your code structure, dependencies and more" },
                { icon: "🤖", title: "AI Authoring", desc: "Claude writes clear, professional documentation" },
                { icon: "🎨", title: "Styled Output", desc: "Badges, tables, and GitHub-flavored markdown" },
                { icon: "📋", title: "One-click Copy", desc: "Drop straight into your repository" },
              ].map((f) => (
                <div
                  key={f.title}
                  className="glass rounded-xl p-4"
                  style={{ cursor: "default" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                >
                  <div style={{ fontSize: "1.3rem", marginBottom: "8px" }}>{f.icon}</div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "0.82rem", color: "var(--text-primary)", marginBottom: "4px" }}>{f.title}</p>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "16px 32px" }} className="flex items-center justify-between">
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "var(--text-muted)" }}>
            GitSCRIBE © 2025
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "var(--text-muted)" }}>
            powered by{" "}
            <span style={{ color: "#c084fc" }}>Claude</span>
          </span>
        </footer>
      </div>
    </div>
  );
}