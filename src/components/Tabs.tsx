"use client";

import { useState, type ReactNode } from "react";

export function Tabs({
  tabs,
}: {
  tabs: { key: string; label: string; content: ReactNode }[];
}) {
  const [active, setActive] = useState(tabs[0]?.key);

  return (
    <div>
      <div className="flex gap-1 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`-mb-px rounded-t-md border-b-2 px-4 py-2 text-sm font-medium transition ${
              active === tab.key
                ? "border-slate-800 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-5">
        {tabs.find((t) => t.key === active)?.content}
      </div>
    </div>
  );
}
