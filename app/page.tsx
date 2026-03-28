"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Mode = "repo-url" | "manual";
type PreviewTab = "preview" | "raw";

/* ── Inline SVG icons ─────────────────────────────────────── */
const IconGitHub = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const IconBolt = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconCopy = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const IconDownload = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconFile = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const Logo = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <rect width="26" height="26" rx="7" fill="#111318" />
    <rect x="6" y="7" width="14" height="1.8" rx="0.9" fill="#E8E6FF" />
    <rect x="6" y="11" width="10" height="1.5" rx="0.75" fill="#6B6A8A" />
    <rect x="6" y="14.5" width="12" height="1.5" rx="0.75" fill="#6B6A8A" />
    <rect x="6" y="18" width="8" height="1.5" rx="0.75" fill="#6B6A8A" />
    <circle cx="19" cy="17" r="4.5" fill="#111318" stroke="#7C6BE8" strokeWidth="1.4" />
    <path d="M17.4 17l1.2 1.2 2-2.4" stroke="#7C6BE8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Spinner ───────────────────────────────────────────────── */
const Spinner = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.75s" repeatCount="indefinite" />
    </path>
  </svg>
);

/* ── Copy button with state ────────────────────────────────── */
function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  };
  return (
    <button onClick={copy} className="action-btn">
      <IconCopy />
      <span>{done ? "Copied" : "Copy"}</span>
    </button>
  );
}

/* ── Download button ───────────────────────────────────────── */
function DownloadBtn({ text }: { text: string }) {
  const dl = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
    a.download = "README.md";
    a.click();
  };
  return (
    <button onClick={dl} className="action-btn">
      <IconDownload />
      <span>.md</span>
    </button>
  );
}

/* ── Option checkbox ───────────────────────────────────────── */
function Option({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="option-row">
      <div className={`checkbox ${checked ? "checked" : ""}`}>
        {checked && (
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="2,6 5,9 10,3" />
          </svg>
        )}
      </div>
      <span>{label}</span>
    </label>
  );
}

/* ── Main page ─────────────────────────────────────────────── */
export default function Page() {
  const [mode, setMode] = useState<Mode>("repo-url");
  const [repoUrl, setRepoUrl] = useState("");
  const [manualDetails, setManualDetails] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewTab, setPreviewTab] = useState<PreviewTab>("preview");
  const [opts, setOpts] = useState({ badges: true, license: true, contributing: false, roadmap: false });

  const toggle = (k: keyof typeof opts) => setOpts(p => ({ ...p, [k]: !p[k] }));

  const handleGenerate = async () => {
    setLoading(true);
    setMarkdown("");
    try {
      const res = await fetch("/api/repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, manualDetails, options: opts }),
      });
      const data = await res.json();
      setMarkdown(data.readme ?? "# Error\n\nFailed to generate.");
    } catch {
      setMarkdown("# Error\n\nFailed to generate README. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canGenerate = mode === "repo-url" ? repoUrl.trim().length > 0 : manualDetails.trim().length > 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:       #0C0D11;
          --surface:  #111318;
          --surface2: #16181F;
          --border:   rgba(255,255,255,0.07);
          --border2:  rgba(255,255,255,0.12);
          --accent:   #7C6BE8;
          --accent-d: #6356C8;
          --accent-h: rgba(124,107,232,0.12);
          --text-1:   #E8E6FF;
          --text-2:   #8B8AA8;
          --text-3:   #4A4966;
          --radius:   10px;
          --radius-lg:14px;
        }

        body {
          background: var(--bg);
          color: var(--text-1);
          font-family: 'Geist', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Subtle noise texture overlay ── */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.022;
          pointer-events: none;
          z-index: 100;
        }

        /* ── Layout ── */
        .page { display: flex; flex-direction: column; min-height: 100vh; }

        /* ── Nav ── */
        .nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; height: 56px;
          border-bottom: 1px solid var(--border);
          position: sticky; top: 0; z-index: 40;
          background: rgba(12,13,17,0.88);
          backdrop-filter: blur(14px);
        }
        .nav-brand { display: flex; align-items: center; gap: 10px; }
        .brand-name {
          font-family: 'Geist', sans-serif;
          font-size: 14px; font-weight: 600; letter-spacing: -0.01em;
          color: var(--text-1);
        }
        .nav-right { display: flex; align-items: center; gap: 20px; }
        .nav-link {
          font-size: 13px; color: var(--text-2);
          text-decoration: none; transition: color 0.15s;
        }
        .nav-link:hover { color: var(--text-1); }
        .badge-api {
          display: flex; align-items: center; gap: 6px;
          font-family: 'Geist Mono', monospace;
          font-size: 11px; color: var(--text-3);
          letter-spacing: 0.04em;
        }
        .dot-online {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4ADE80;
        }

        /* ── Main ── */
        .main {
          flex: 1;
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 0;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          padding: 32px 32px 48px;
          gap: 24px;
          align-items: start;
        }

        /* ── Panel ── */
        .panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .panel-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid var(--border);
        }
        .panel-title {
          font-size: 12px; font-weight: 500; color: var(--text-2);
          letter-spacing: 0.03em; text-transform: uppercase;
          display: flex; align-items: center; gap: 7px;
        }
        .panel-body { padding: 20px 18px; display: flex; flex-direction: column; gap: 18px; }

        /* ── Segment control ── */
        .segment {
          display: flex; gap: 2px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px; padding: 3px;
        }
        .seg-btn {
          flex: 1; padding: 5px 12px;
          border: none; border-radius: 6px;
          background: transparent; color: var(--text-3);
          font-family: 'Geist', sans-serif;
          font-size: 12px; font-weight: 500; cursor: pointer;
          transition: all 0.15s;
        }
        .seg-btn:hover { color: var(--text-2); }
        .seg-btn.active {
          background: var(--surface2);
          color: var(--text-1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        /* ── Label ── */
        .field-label {
          font-size: 11px; font-weight: 500; color: var(--text-3);
          letter-spacing: 0.05em; text-transform: uppercase;
          margin-bottom: 7px; display: block;
        }

        /* ── Input ── */
        .field-input {
          width: 100%;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 10px 12px 10px 36px;
          font-family: 'Geist Mono', monospace;
          font-size: 13px; color: var(--text-1);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field-input::placeholder { color: var(--text-3); }
        .field-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(124,107,232,0.15);
        }
        .input-wrap { position: relative; }
        .input-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: var(--text-3); pointer-events: none;
        }

        /* ── Textarea ── */
        .field-textarea {
          width: 100%; min-height: 110px; resize: vertical;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 12px 14px;
          font-family: 'Geist Mono', monospace;
          font-size: 12.5px; color: var(--text-1); line-height: 1.7;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field-textarea::placeholder { color: var(--text-3); }
        .field-textarea:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(124,107,232,0.15);
        }

        /* ── Quick suggestions ── */
        .suggestions { display: flex; flex-wrap: wrap; gap: 6px; }
        .suggestion-btn {
          font-family: 'Geist Mono', monospace; font-size: 11px;
          color: var(--text-3);
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 6px; padding: 3px 9px;
          cursor: pointer; transition: all 0.15s;
        }
        .suggestion-btn:hover {
          color: var(--accent); border-color: rgba(124,107,232,0.4);
        }

        /* ── Divider ── */
        .divider { height: 1px; background: var(--border); }

        /* ── Options grid ── */
        .opts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .option-row {
          display: flex; align-items: center; gap: 9px;
          padding: 8px 10px; border-radius: 8px;
          border: 1px solid var(--border);
          background: transparent; cursor: pointer;
          transition: border-color 0.15s;
          font-size: 12.5px; color: var(--text-2);
        }
        .option-row:hover { border-color: var(--border2); }
        .checkbox {
          width: 14px; height: 14px; border-radius: 4px; flex-shrink: 0;
          border: 1px solid var(--border2);
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .checkbox.checked {
          background: var(--accent);
          border-color: var(--accent);
        }

        /* ── Generate button ── */
        .btn-generate {
          width: 100%; height: 42px;
          background: var(--accent);
          color: white; border: none;
          border-radius: var(--radius);
          font-family: 'Geist', sans-serif;
          font-size: 13.5px; font-weight: 600;
          letter-spacing: -0.01em;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
        }
        .btn-generate:hover:not(:disabled) {
          background: var(--accent-d);
          box-shadow: 0 0 0 3px rgba(124,107,232,0.2);
        }
        .btn-generate:active:not(:disabled) { transform: scale(0.99); }
        .btn-generate:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ── Preview panel ── */
        .preview-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          display: flex; flex-direction: column;
          min-height: 560px;
        }
        .preview-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .preview-meta { display: flex; align-items: center; gap: 10px; }
        .preview-actions { display: flex; align-items: center; gap: 6px; }

        /* ── Action buttons ── */
        .action-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 10px; border-radius: 7px;
          border: 1px solid var(--border);
          background: transparent; color: var(--text-2);
          font-family: 'Geist', sans-serif;
          font-size: 12px; font-weight: 500; cursor: pointer;
          transition: all 0.15s;
        }
        .action-btn:hover { color: var(--text-1); border-color: var(--border2); }
        .seg-sm {
          display: flex; gap: 1px;
          background: var(--bg);
          border: 1px solid var(--border); border-radius: 7px; padding: 2px;
        }
        .seg-sm .seg-btn { padding: 4px 10px; font-size: 11.5px; }

        /* ── Preview body ── */
        .preview-body {
          flex: 1; overflow-y: auto; padding: 28px 32px;
        }

        /* ── Empty state ── */
        .empty-state {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 12px;
          height: 100%; min-height: 420px;
          color: var(--text-3); text-align: center;
        }
        .empty-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: var(--surface2);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-3);
        }
        .empty-state p { font-size: 13px; color: var(--text-3); }

        /* ── Skeleton ── */
        .skeleton-wrap { display: flex; flex-direction: column; gap: 12px; padding: 4px 0; }
        .skel {
          height: 14px; border-radius: 6px;
          background: linear-gradient(90deg, var(--surface2) 25%, var(--surface) 50%, var(--surface2) 75%);
          background-size: 400% 100%;
          animation: skel-shine 1.6s ease-in-out infinite;
        }
        @keyframes skel-shine {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }

        /* ── Markdown preview ── */
        .md-preview {
          font-family: 'Geist', sans-serif;
          font-size: 14px; line-height: 1.75; color: #C8C6E0;
        }
        .md-preview h1 {
          font-size: 22px; font-weight: 700; letter-spacing: -0.02em;
          color: var(--text-1); margin-bottom: 16px;
          padding-bottom: 12px; border-bottom: 1px solid var(--border);
        }
        .md-preview h2 {
          font-size: 16px; font-weight: 600; color: #D8D6F4;
          margin: 24px 0 10px; padding-bottom: 8px;
          border-bottom: 1px solid var(--border);
        }
        .md-preview h3 { font-size: 14px; font-weight: 600; color: #C8C6E0; margin: 18px 0 8px; }
        .md-preview p { margin-bottom: 12px; }
        .md-preview a { color: var(--accent); text-decoration: none; }
        .md-preview a:hover { text-decoration: underline; }
        .md-preview code {
          font-family: 'Geist Mono', monospace; font-size: 12px;
          background: rgba(124,107,232,0.1);
          border: 1px solid rgba(124,107,232,0.18);
          border-radius: 5px; padding: 1px 6px; color: #A89EE8;
        }
        .md-preview pre {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 10px; padding: 16px 18px; margin: 14px 0; overflow-x: auto;
        }
        .md-preview pre code { background: none; border: none; padding: 0; color: var(--text-2); font-size: 12.5px; }
        .md-preview ul, .md-preview ol { padding-left: 20px; margin-bottom: 12px; }
        .md-preview li { margin-bottom: 4px; }
        .md-preview blockquote {
          border-left: 2px solid var(--accent);
          background: var(--accent-h);
          padding: 10px 16px; margin: 14px 0;
          border-radius: 0 8px 8px 0; color: var(--text-2);
        }
        .md-preview table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 13px; }
        .md-preview th {
          background: var(--surface2); border: 1px solid var(--border);
          padding: 8px 12px; text-align: left; font-size: 11px;
          font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
          color: var(--text-2);
        }
        .md-preview td { border: 1px solid var(--border); padding: 7px 12px; }
        .md-preview hr { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
        .md-preview img { max-width: 100%; border-radius: 8px; }

        /* ── Raw view ── */
        .raw-view {
          font-family: 'Geist Mono', monospace;
          font-size: 12.5px; line-height: 1.75;
          color: var(--text-2); white-space: pre-wrap;
          word-break: break-word;
        }

        /* ── Footer ── */
        .footer {
          border-top: 1px solid var(--border);
          padding: 14px 32px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .footer-text { font-size: 12px; color: var(--text-3); }
        .footer-link { color: var(--accent); text-decoration: none; }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.14); }

        /* ── Word count badge ── */
        .word-badge {
          font-family: 'Geist Mono', monospace; font-size: 11px;
          color: var(--text-3);
          padding: 2px 8px; border-radius: 5px;
          background: var(--surface2); border: 1px solid var(--border);
        }
      `}</style>

      <div className="page">
        {/* ── Nav ── */}
        <nav className="nav">
          <div className="nav-brand">
            <Logo />
            <span className="brand-name">git.scribe</span>
          </div>
          <div className="nav-right">
            <a href="#" className="nav-link">Docs</a>
            <a href="#" className="nav-link">Examples</a>
            <div className="badge-api">
              <div className="dot-online" />
              <span>API ONLINE</span>
            </div>
          </div>
        </nav>

        {/* ── Main ── */}
        <main className="main">

          {/* ── Input panel ── */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">
                <IconFile /> Input
              </span>
              <div className="segment">
                <button className={`seg-btn ${mode === "repo-url" ? "active" : ""}`} onClick={() => setMode("repo-url")}>
                  URL
                </button>
                <button className={`seg-btn ${mode === "manual" ? "active" : ""}`} onClick={() => setMode("manual")}>
                  Manual
                </button>
              </div>
            </div>

            <div className="panel-body">
              {mode === "repo-url" ? (
                <div>
                  <span className="field-label">GitHub Repository URL</span>
                  <div className="input-wrap">
                    <span className="input-icon"><IconGitHub /></span>
                    <input
                      type="url"
                      value={repoUrl}
                      onChange={e => setRepoUrl(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && canGenerate && handleGenerate()}
                      placeholder="https://github.com/owner/repository"
                      className="field-input"
                    />
                  </div>
                  <div className="suggestions" style={{ marginTop: 10 }}>
                    {["vercel/next.js", "facebook/react", "tailwindlabs/tailwindcss"].map(s => (
                      <button key={s} className="suggestion-btn" onClick={() => setRepoUrl(`https://github.com/${s}`)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <span className="field-label">Project Details</span>
                  <textarea
                    value={manualDetails}
                    onChange={e => setManualDetails(e.target.value)}
                    placeholder={"Name: My Project\nDescription: A tool that...\nFeatures: auth, dark mode\nStack: Next.js, TypeScript"}
                    className="field-textarea"
                  />
                </div>
              )}

              <div className="divider" />

              <div>
                <span className="field-label">Sections</span>
                <div className="opts-grid">
                  <Option label="Badges"       checked={opts.badges}       onChange={() => toggle("badges")} />
                  <Option label="License"      checked={opts.license}      onChange={() => toggle("license")} />
                  <Option label="Contributing" checked={opts.contributing}  onChange={() => toggle("contributing")} />
                  <Option label="Roadmap"      checked={opts.roadmap}      onChange={() => toggle("roadmap")} />
                </div>
              </div>

              <button
                className="btn-generate"
                onClick={handleGenerate}
                disabled={loading || !canGenerate}
              >
                {loading ? (
                  <><Spinner /> Generating…</>
                ) : (
                  <><IconBolt /> Generate README</>
                )}
              </button>
            </div>
          </div>

          {/* ── Preview panel ── */}
          <div className="preview-panel">
            <div className="preview-header">
              <div className="preview-meta">
                <IconFile />
                <span style={{ fontSize: 12, color: "var(--text-2)", fontFamily: "'Geist Mono', monospace" }}>
                  README.md
                </span>
                {markdown && (
                  <span className="word-badge">{Math.round(markdown.split(/\s+/).length)} words</span>
                )}
              </div>
              <div className="preview-actions">
                {markdown && (
                  <>
                    <div className="seg-sm">
                      <button className={`seg-btn ${previewTab === "preview" ? "active" : ""}`} onClick={() => setPreviewTab("preview")}>Preview</button>
                      <button className={`seg-btn ${previewTab === "raw" ? "active" : ""}`} onClick={() => setPreviewTab("raw")}>Raw</button>
                    </div>
                    <CopyBtn text={markdown} />
                    <DownloadBtn text={markdown} />
                  </>
                )}
              </div>
            </div>

            <div className="preview-body">
              {loading ? (
                <div className="skeleton-wrap">
                  {[70, 45, 90, 55, 80, 40, 65, 75, 50].map((w, i) => (
                    <div key={i} className="skel" style={{
                      width: `${w}%`,
                      height: i === 0 ? 22 : 13,
                      marginTop: i === 3 ? 20 : 0,
                    }} />
                  ))}
                </div>
              ) : markdown ? (
                previewTab === "preview" ? (
                  <div className="md-preview">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                  </div>
                ) : (
                  <pre className="raw-view">{markdown}</pre>
                )
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <p>Paste a GitHub URL and click Generate</p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="footer">
          <span className="footer-text">git.scribe © 2025</span>
          <span className="footer-text">
            by <a href="https://github.com/davex-ai" className="footer-link">Dave</a>
          </span>
        </footer>
      </div>
    </>
  );
}
