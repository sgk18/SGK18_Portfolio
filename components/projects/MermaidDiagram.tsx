"use client";

import { useEffect, useRef } from "react";

interface MermaidDiagramProps {
  readonly chart: string;
  readonly id: string;
}

export default function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !chart) return;
    let cancelled = false;

    import("mermaid")
      .then((mermaid) => {
        if (cancelled) return;
        mermaid.default.initialize({
          startOnLoad: false,
          theme: "default",
          themeVariables: {
            background: "#ffffff",
            primaryColor: "#fff5f5",
            primaryTextColor: "#0a0a0a",
            primaryBorderColor: "#0a0a0a",
            lineColor: "#e3000f",
            secondaryColor: "#ffffff",
            tertiaryColor: "#ffffff",
          },
        });
        return mermaid.default.render(id, chart.trim());
      })
      .then((result) => {
        if (result && ref.current && !cancelled) {
          ref.current.innerHTML = result.svg;
        }
      })
      .catch(() => {
        if (ref.current && !cancelled) {
          ref.current.textContent = "";
          const pre = document.createElement("pre");
          pre.className = "text-xs font-mono text-[#0A0A0A] p-4 overflow-auto w-full";
          pre.textContent = chart;
          ref.current.appendChild(pre);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <div
      ref={ref}
      className="bg-white rounded-none border-2 border-[#0A0A0A] p-4 overflow-auto min-h-[120px] flex items-center justify-center shadow-[4px_4px_0px_#0A0A0A]"
    />
  );
}
