"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Mode = "repo-url" | "manual";
type PreviewTab = "preview" | "raw";

/* ── Icons ──────────────────────────────────────────────────────── */
const IconGithub = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const IconFile = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);

const IconCopy = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const IconDownload = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconZap = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

/* ── Logo ─────────────────────────────────────────────────────────── */
const Logo = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <rect width="26" height="26" rx="6" fill="#18181b"/>
    <rect x="5.5" y="6.5" width="15" height="1.7" rx="0.85" fill="#f59e0b"/>
    <rect x="5.5" y="10.2" width="11" height="1.7" rx="0.85" fill="#52525b"/>
    <rect x="5.5" y="13.9" width="13" height="1.7" rx="0.85" fill="#52525b"/>
    <rect x="5.5" y="17.6" width="8"  height="1.7" rx="0.85" fill="#52525b"/>
  </svg>
);

/* ── Sub-components ───────────────────────────────────────────────── */
function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all text-xs"
      style={{
        fontFamily: "'DM Mono', monospace",
        background: done ? "rgba(34,197,94,0.07)" : "rgba(255,255,255,0.03)",
        color: done ? "#4ade80" : "#52525b",
        border: `1px solid ${done ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.07)"}`,
      }}
    >
      {done ? <IconCheck /> : <IconCopy />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

function DownloadBtn({ content }: { content: string }) {
  const handle = () => {
    const url = URL.createObjectURL(new Blob([content], { type: "text/markdown" }));
    Object.assign(document.createElement("a"), { href: url, download: "README.md" }).click();
    URL.revokeObjectURL(url);
  };
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all text-xs"
      style={{ fontFamily: "'DM Mono', monospace", background: "rgba(255,255,255,0.03)", color: "#52525b", border: "1px solid rgba(255,255,255,0.07)" }}
      onMouseEnter={e => { e.currentTarget.style.color = "#a1a1aa"; }}
      onMouseLeave={e => { e.currentTarget.style.color = "#52525b"; }}
    >
      <IconDownload /> .md
    </button>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none" onClick={onChange}>
      <div className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 transition-all"
        style={{ background: checked ? "#f59e0b" : "transparent", border: `1px solid ${checked ? "#f59e0b" : "rgba(255,255,255,0.1)"}` }}>
        {checked && <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round"><polyline points="1.5,5 4,7.5 8.5,2.5"/></svg>}
      </div>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#71717a" }}>{label}</span>
    </label>
  );
}

function TabBar({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
      {options.map((o, i) => (
        <button key={o} onClick={() => onChange(o)}
          style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.63rem", letterSpacing: "0.03em",
            padding: "5px 13px", cursor: "pointer", transition: "all 0.15s",
            borderRight: i < options.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
            background: value === o ? "rgba(255,255,255,0.06)" : "transparent",
            color: value === o ? "#d4d4d8" : "#52525b",
          }}
        >{o}</button>
      ))}
    </div>
  );
}

function Skeleton() {
  const lines = [52, 0, 88, 70, 78, 0, 42, 64, 56, 0, 84, 48];
  return (
    <div className="space-y-2.5 pt-1">
      {lines.map((w, i) =>
        w === 0 ? <div key={i} className="h-2" /> : (
          <div key={i} className="rounded" style={{
            height: i === 0 ? 20 : 11, width: `${w}%`,
            background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 100%)",
            backgroundSize: "400% 100%", animation: "shimmer 1.6s ease-in-out infinite",
          }}/>
        )
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function Page() {
  const [mode, setMode]             = useState<Mode>("repo-url");
  const [repoUrl, setRepoUrl]       = useState("");
  const [manual, setManual]         = useState("");
  const [markdown, setMarkdown]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [previewTab, setPreviewTab] = useState<PreviewTab>("preview");
  const [opts, setOpts]             = useState({ Badges: true, License: true, Contributing: false, Roadmap: false });
  const inputRef = useRef<HTMLInputElement>(null);

  const toggle = (k: keyof typeof opts) => setOpts(p => ({ ...p, [k]: !p[k] }));

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/repo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ repoUrl, options: opts }) });
      const data = await res.json();
      setMarkdown(data.readme ?? "# Error\n\nFailed to generate.");
    } catch {
      setMarkdown("# Error\n\nFailed to generate README. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const PANEL = "rounded-xl overflow-hidden flex flex-col";
  const PANEL_STYLE = { border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.018)" };
  const HDR_STYLE   = { borderBottom: "1px solid rgba(255,255,255,0.05)" };
  const MONO        = { fontFamily: "'DM Mono', monospace" } as const;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap');
        @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fu  { animation: fadeUp 0.42s cubic-bezier(0.22,1,0.36,1) both; }
        .fu1 { animation-delay: 0.06s; } .fu2 { animation-delay: 0.12s; } .fu3 { animation-delay: 0.18s; }
        input, textarea { outline: none; }
        input::placeholder, textarea::placeholder { color: #3f3f46; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 10px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.7s linear infinite; }

        /* Markdown */
        .md { font-size: 13.5px; line-height: 1.75; color: #a1a1aa; }
        .md h1 { font-size: 1.5rem; font-weight: 700; color: #fafafa; border-bottom: 1px solid rgba(255,255,255,0.07); padding-bottom: .45rem; margin: 0 0 1rem; }
        .md h2 { font-size: 1.1rem; font-weight: 600; color: #e4e4e7; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: .3rem; margin: 1.5rem 0 .65rem; }
        .md h3 { font-size: .9rem; font-weight: 600; color: #d4d4d8; margin: 1.1rem 0 .45rem; }
        .md p  { margin-bottom: .8rem; }
        .md a  { color: #f59e0b; text-decoration: none; }
        .md a:hover { text-decoration: underline; }
        .md code { font-family:'DM Mono',monospace; font-size:.78rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:4px; padding:1px 5px; color:#a1a1aa; }
        .md pre  { background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.07); border-radius:8px; padding:.9rem 1.1rem; margin:.85rem 0; overflow-x:auto; }
        .md pre code { background:none; border:none; padding:0; }
        .md ul,.md ol { padding-left:1.35rem; margin-bottom:.8rem; }
        .md li { margin-bottom:.22rem; }
        .md blockquote { border-left:2px solid #f59e0b; padding:.5rem .9rem; margin:.85rem 0; color:#71717a; background:rgba(245,158,11,0.04); border-radius:0 6px 6px 0; }
        .md hr { border:none; border-top:1px solid rgba(255,255,255,0.07); margin:1.3rem 0; }
        .md img { max-width:100%; border-radius:6px; }
        .md table { width:100%; border-collapse:collapse; margin:.85rem 0; font-size:.82rem; }
        .md th { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); padding:6px 11px; text-align:left; color:#71717a; font-family:'DM Mono',monospace; font-size:.7rem; }
        .md td { border:1px solid rgba(255,255,255,0.05); padding:6px 11px; }
      `}</style>

      <div className="min-h-screen" style={{ background: "#0c0c0e", color: "#e4e4e7" }}>

        {/* Nav */}
        <header className="fu border-b sticky top-0 z-40"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(12,12,14,0.92)", backdropFilter: "blur(14px)" }}>
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Logo />
              <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: "0.95rem", color: "#fafafa" }}>GitScribe</span>
              <span style={{ ...MONO, fontSize: "0.58rem", padding: "2px 6px", borderRadius: 4, background: "rgba(245,158,11,0.09)", border: "1px solid rgba(245,158,11,0.18)", color: "#f59e0b", letterSpacing: "0.06em" }}>v2</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 5px #34d399" }}/>
                <span style={{ ...MONO, fontSize: "0.63rem", color: "#3f3f46", letterSpacing: "0.06em" }}>ONLINE</span>
              </div>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                style={{ ...MONO, fontSize: "0.7rem", color: "#52525b", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#a1a1aa"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#52525b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}>
                <IconGithub /> GitHub
              </a>
            </div>
          </div>
        </header>

        {/* Hero */}
        <div className="fu fu1 max-w-6xl mx-auto px-6 pt-14 pb-10">
          <p style={{ ...MONO, fontSize: "0.65rem", color: "#f59e0b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.9rem" }}>
            README Generator
          </p>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.9rem,3.5vw,2.8rem)", fontWeight: 400, lineHeight: 1.18, letterSpacing: "-0.02em", color: "#fafafa", marginBottom: "0.8rem", maxWidth: 520 }}>
            Professional READMEs,{" "}
            <span style={{ color: "#52525b", fontStyle: "italic" }}>generated in seconds.</span>
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#3f3f46", maxWidth: 400, lineHeight: 1.7 }}>
            Paste a GitHub URL and get a polished, badge-ready README ready to ship.
          </p>
        </div>

        {/* Two-column */}
        <div className="fu fu2 max-w-6xl mx-auto px-6 pb-20">
          <div className="grid gap-5 items-start" style={{ gridTemplateColumns: "380px 1fr" }}>

            {/* Input panel */}
            <div className={PANEL} style={PANEL_STYLE}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3" style={HDR_STYLE}>
                <div className="flex items-center gap-2" style={{ color: "#3f3f46" }}>
                  <IconFile size={12} />
                  <span style={{ ...MONO, fontSize: "0.63rem", letterSpacing: "0.04em" }}>input.config</span>
                </div>
                <TabBar options={["URL", "Manual"]} value={mode === "repo-url" ? "URL" : "Manual"} onChange={v => setMode(v === "URL" ? "repo-url" : "manual")} />
              </div>

              <div className="p-5 space-y-5">
                {/* Input */}
                {mode === "repo-url" ? (
                  <div>
                    <label style={{ ...MONO, fontSize: "0.62rem", color: "#3f3f46", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Repository URL</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#3f3f46" }}><IconGithub /></div>
                      <input
                        ref={inputRef} type="url" value={repoUrl}
                        onChange={e => setRepoUrl(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleGenerate()}
                        placeholder="https://github.com/owner/repo"
                        className="w-full rounded-lg pl-9 pr-4 py-2.5"
                        style={{ ...MONO, fontSize: "0.78rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#e4e4e7", caretColor: "#f59e0b", transition: "border-color 0.15s" }}
                        onFocus={e => { e.target.style.borderColor = "rgba(245,158,11,0.3)"; }}
                        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {["vercel/next.js", "facebook/react", "tailwindlabs/tailwindcss"].map(s => (
                        <button key={s} onClick={() => setRepoUrl(`https://github.com/${s}`)}
                          style={{ ...MONO, fontSize: "0.6rem", padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", color: "#3f3f46", cursor: "pointer", transition: "color 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.color = "#71717a"}
                          onMouseLeave={e => e.currentTarget.style.color = "#3f3f46"}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label style={{ ...MONO, fontSize: "0.62rem", color: "#3f3f46", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Project Details</label>
                    <textarea
                      value={manual} onChange={e => setManual(e.target.value)} rows={5}
                      placeholder={"Name: My Tool\nDescription: A CLI that...\nFeatures: auth, dark mode\nStack: Next.js, TS"}
                      className="w-full rounded-lg p-3.5 resize-none"
                      style={{ ...MONO, fontSize: "0.75rem", lineHeight: 1.75, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#e4e4e7", caretColor: "#f59e0b", transition: "border-color 0.15s" }}
                      onFocus={e => e.target.style.borderColor = "rgba(245,158,11,0.3)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                    />
                  </div>
                )}

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

                {/* Options */}
                <div>
                  <p style={{ ...MONO, fontSize: "0.62rem", color: "#3f3f46", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Sections</p>
                  <div className="grid grid-cols-2 gap-y-3">
                    {(Object.keys(opts) as (keyof typeof opts)[]).map(k => (
                      <Checkbox key={k} label={k} checked={opts[k]} onChange={() => toggle(k)} />
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

                {/* Generate */}
                <button
                  onClick={handleGenerate} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 font-medium transition-all"
                  style={{
                    background: loading ? "rgba(245,158,11,0.1)" : "#f59e0b",
                    color: loading ? "#78350f" : "#0c0c0e",
                    fontSize: "0.85rem", border: `1px solid ${loading ? "rgba(245,158,11,0.18)" : "#f59e0b"}`,
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: loading ? "none" : "0 1px 6px rgba(245,158,11,0.22)",
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#fbbf24"; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#f59e0b"; }}
                >
                  {loading ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="spin">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      <span style={{ ...MONO, fontSize: "0.72rem", letterSpacing: "0.07em" }}>GENERATING…</span>
                    </>
                  ) : (
                    <><IconZap /> Generate README</>
                  )}
                </button>

                {/* Meta */}
                <div className="flex items-center justify-between px-1">
                  {[["~8s", "generation"], ["0kb", "stored"], ["md", "format"]].map(([v, l]) => (
                    <div key={l} className="text-center">
                      <div style={{ ...MONO, fontSize: "0.7rem", color: "#71717a", fontWeight: 500 }}>{v}</div>
                      <div style={{ ...MONO, fontSize: "0.58rem", color: "#27272a", letterSpacing: "0.05em" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview panel */}
            <div className={PANEL} style={{ ...PANEL_STYLE, minHeight: 580 }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 shrink-0" style={HDR_STYLE}>
                <div className="flex items-center gap-2">
                  <div style={{ color: "#3f3f46" }}><IconFile size={12} /></div>
                  <span style={{ ...MONO, fontSize: "0.63rem", color: "#52525b", letterSpacing: "0.04em" }}>README.md</span>
                  {markdown && (
                    <span style={{ ...MONO, fontSize: "0.58rem", padding: "1px 6px", borderRadius: 3, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#3f3f46" }}>
                      {Math.ceil(markdown.split(/\s+/).filter(Boolean).length)} words
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <TabBar options={["preview", "raw"]} value={previewTab} onChange={v => setPreviewTab(v as PreviewTab)} />
                  {markdown && <><CopyBtn text={markdown} /><DownloadBtn content={markdown} /></>}
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <Skeleton />
                ) : markdown ? (
                  previewTab === "preview" ? (
                    <div className="md"><ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown></div>
                  ) : (
                    <pre style={{ ...MONO, fontSize: "0.73rem", lineHeight: 1.75, color: "#3f3f46", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{markdown}</pre>
                  )
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-3 py-20 text-center">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ color: "#27272a" }}><IconFile size={18} /></div>
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: "0.95rem", color: "#3f3f46", fontStyle: "italic", marginBottom: 4 }}>No file generated yet</p>
                      <p style={{ ...MONO, fontSize: "0.63rem", color: "#27272a" }}>Paste a URL → Generate</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo />
              <span style={{ ...MONO, fontSize: "0.62rem", color: "#27272a" }}>GitScribe © 2025</span>
            </div>
            <span style={{ ...MONO, fontSize: "0.62rem", color: "#27272a" }}>
              by{" "}
              <a href="https://github.com/davex-ai" style={{ color: "#3f3f46", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#71717a"}
                onMouseLeave={e => e.currentTarget.style.color = "#3f3f46"}>
                Dave
              </a>
            </span>
          </div>
        </footer>

      </div>
    </>
  );
}
