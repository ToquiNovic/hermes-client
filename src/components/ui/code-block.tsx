"use client";
import { useEffect, useState, useMemo } from "react";
import { getHighlighter } from "shikiji";
import { Check, Copy } from "lucide-react";

type CodeBlockProps = {
  language: string;
  filename: string;
  highlightLines?: number[];
} & (
  | {
      code: string;
      tabs?: never;
    }
  | {
      code?: never;
      tabs: Array<{
        name: string;
        code: string;
        language?: string;
        highlightLines?: number[];
      }>;
    }
);

export const CodeBlock = ({
  language,
  filename,
  code,
  highlightLines = [],
  tabs = [],
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [html, setHtml] = useState("");

  const tabsExist = tabs.length > 0;
  const activeCode = tabsExist ? tabs[activeTab].code : code ?? "";
  const activeLanguage = tabsExist ? tabs[activeTab].language || language : language;

  const activeHighlightLines = useMemo(
    () => (tabsExist ? tabs[activeTab].highlightLines || [] : highlightLines),
    [tabsExist, tabs, activeTab, highlightLines]
  );

  useEffect(() => {
    const loadHighlighter = async () => {
      const highlighter = await getHighlighter({ themes: ["github-dark"] });
      const highlightedHtml = highlighter.codeToHtml(activeCode ?? "", {
        lang: activeLanguage || "plaintext",
        theme: "github-dark",
      });

      // Modificar el HTML generado para resaltar las líneas especificadas
      const lines = highlightedHtml.split("\n").map((line, index) => {
        if (activeHighlightLines.includes(index + 1)) {
          return `<div class="highlight">${line}</div>`;
        }
        return `<div>${line}</div>`;
      });

      setHtml(lines.join("\n"));
    };

    loadHighlighter();
  }, [activeCode, activeLanguage, activeHighlightLines]);

  const copyToClipboard = async () => {
    if (activeCode) {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative w-full rounded-lg bg-slate-900 p-4 font-mono text-sm">
      <div className="flex flex-col gap-2">
        {tabsExist && (
          <div className="flex overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-3 !py-2 text-xs transition-colors font-sans ${
                  activeTab === index ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}
        {!tabsExist && filename && (
          <div className="flex justify-between items-center py-2">
            <div className="text-xs text-zinc-400">{filename}</div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-sans"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
      <style>
        {`
          .highlight {
            background-color: rgba(255, 255, 0, 0.2);
            display: block;
            width: 100%;
          }
        `}
      </style>
    </div>
  );
};
