// @/components/ui/code-block.tsx
"use client";
import { useEffect, useState, useMemo } from "react";
import { getHighlighter } from "shikiji";
// import { Check, Copy } from "lucide-react";

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
  const activeLanguage = tabsExist
    ? tabs[activeTab].language || language
    : language;

  const activeHighlightLines = useMemo(
    () => (tabsExist ? tabs[activeTab].highlightLines || [] : highlightLines),
    [tabsExist, tabs, activeTab, highlightLines]
  );

  useEffect(() => {
    const loadHighlighter = async () => {
      const highlighter = await getHighlighter({
        themes: ["github-dark"],
        langs: ["jsx", "cpp"],
      });

      const highlightedHtml = highlighter.codeToHtml(activeCode ?? "", {
        lang: activeLanguage || "plaintext",
        theme: "github-dark",
      });

      // Modificar el HTML generado para agregar numeración de líneas
      const lines = highlightedHtml.split("\n").map((line, index) => {
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
                  activeTab === index
                    ? "text-white"
                    : "text-zinc-400 hover:text-zinc-200"
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
          </div>
        )}
      </div>

      {/* Icono de copiar en la esquina superior derecha */}
      <button
        onClick={copyToClipboard}
        className="absolute top-4 right-4 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-sans"
      >
        {copied ? <span>✔</span> : <span>📋</span>}
      </button>

      {/* Contenedor del código con scroll */}
      <div
        className="overflow-y-auto max-h-[400px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <style>
        {`
          .code-line {
            display: flex;
            align-items: flex-start; /* Alineación superior para mantener las líneas alineadas */
          }

          .line-number {
            width: 30px; /* Ancho fijo para los números de línea */
            text-align: right;
            margin-right: 10px;
            color: #888;
            font-size: 0.9rem;
            user-select: none; /* Evita que el número sea seleccionable */
          }

          .code-content {
            flex-grow: 1;
            white-space: pre; /* Asegura que los saltos de línea y espacios se mantengan correctamente */
          }

          .highlight {
            background-color: rgba(255, 255, 0, 0.2);
            display: block;
            width: 100%;
            padding: 0 10px; /* Relleno adicional para las líneas resaltadas, si es necesario */
          }
        `}
      </style>
    </div>
  );
};
