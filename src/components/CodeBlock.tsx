import { Check, Copy, Download } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  title: string;
  targetPath?: string;
  language: string;
  code: string;
  downloadFilename?: string;
  maxHeightClass?: string;
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function CodeBlock({
  title,
  targetPath,
  language,
  code,
  downloadFilename,
  maxHeightClass = 'max-h-[520px]',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lineCount = code.split('\n').length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0F1522]">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
            {title}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-0.5">
            {targetPath && <span className="truncate">{targetPath}</span>}
            {targetPath && <span aria-hidden="true">·</span>}
            <span>{language}</span>
            <span aria-hidden="true">·</span>
            <span>{lineCount} líneas</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {downloadFilename && (
            <button
              type="button"
              onClick={() => downloadTextFile(downloadFilename, code)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Descargar</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>

      <pre
        className={`p-4 overflow-x-auto overflow-y-auto ${maxHeightClass} text-[13px] leading-relaxed font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-[#0D121C]`}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
