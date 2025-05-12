import { useEffect, useMemo, useState } from "react";
import { getHighlighter } from "shikiji";

type Tab = {
  name: string;
  code: string;
  language?: string;
  highlightLines?: number[];
};

type CodeBlockProps = {
  language: string;
  filename?: string;
  highlightLines?: number[];
  showCopyButton?: boolean;
  maxHeight?: number;
  onTabChange?: (activeTab: number, code: string) => void;
} & (
  | {
      code: string;
      tabs?: never;
    }
  | {
      code?: never;
      tabs: Tab[];
    }
);

export const CodeBlock = (props: CodeBlockProps) => {
  const { showCopyButton, onTabChange, maxHeight = 400 } = props;

  const tabsExist = "tabs" in props && (props.tabs?.length ?? 0) > 0;
  const [activeTab, setActiveTab] = useState(0);
  const [html, setHtml] = useState("");

  const activeCode = tabsExist ? props.tabs![activeTab].code : props.code ?? "";
  const activeLanguage = tabsExist
    ? props.tabs![activeTab].language || props.language
    : props.language;
  const activeFilename = tabsExist
    ? props.tabs![activeTab].name
    : props.filename;
  const activeHighlightLines = useMemo(
    () =>
      tabsExist
        ? props.tabs![activeTab].highlightLines || []
        : props.highlightLines || [],
    [tabsExist, props.tabs, activeTab, props.highlightLines]
  );

  const highlighterPromise = useMemo(
    () =>
      getHighlighter({
        themes: ["github-dark"],
        langs: ["cpp", "jsx", "plaintext", "ts", "tsx", "js", "json"],
      }),
    []
  );

  useEffect(() => {
    const loadHighlighter = async () => {
      const highlighter = await highlighterPromise;

      const highlightedHtml = highlighter.codeToHtml(activeCode, {
        lang: activeLanguage || "plaintext",
        theme: "github-dark",
      });

      const lines = highlightedHtml
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line, index) => {
          const lineNumber = index + 1;
          const isHighlighted = activeHighlightLines.includes(lineNumber);
          return `
            <div class="code-line ${isHighlighted ? "highlight" : ""}">
              <span class="line-number">${lineNumber}</span>
              <span class="code-content">${line}</span>
            </div>
          `;
        });

      setHtml(lines.join("\n"));
    };

    loadHighlighter();
  }, [activeCode, activeLanguage, activeHighlightLines, highlighterPromise]);

  return (
    <div className="relative w-full rounded-lg bg-slate-900 p-4 font-mono text-sm">
      <div className="flex flex-col gap-2">
        {tabsExist && props.tabs && (
          <div className="flex overflow-x-auto border-b border-zinc-700">
            {props.tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveTab(index);
                  onTabChange?.(index, tab.code);
                }}
                className={`px-3 py-2 text-xs transition-colors font-sans ${
                  activeTab === index
                    ? "text-white border-b-2 border-blue-500"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}
        {!tabsExist && activeFilename && (
          <div className="flex justify-between items-center py-2">
            <div className="text-xs text-zinc-400">{activeFilename}</div>
          </div>
        )}
      </div>

      {showCopyButton && (
        <button
          onClick={() => navigator.clipboard.writeText(activeCode)}
          className="absolute top-2 right-2 text-xs bg-zinc-700 text-white px-2 py-1 rounded hover:bg-zinc-600"
        >
          Copiar
        </button>
      )}

      <div
        className="overflow-y-auto mt-2"
        style={{ maxHeight: `${maxHeight}px` }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <style>{`
        .code-line {
          display: flex;
          align-items: flex-start;
        }
        .line-number {
          width: 30px;
          text-align: right;
          margin-right: 10px;
          color: #888;
          font-size: 0.9rem;
          user-select: none;
        }
        .code-content {
          flex-grow: 1;
          white-space: pre;
        }
        .highlight {
          background-color: rgba(255, 255, 0, 0.15);
          border-left: 3px solid #facc15;
          width: 100%;
          padding: 0 10px;
        }
      `}</style>
    </div>
  );
};
