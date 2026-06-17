"use client";
import { useState } from "react";

interface Props { data: string[]; onChange: (d: string[]) => void; }

export function StepSkills({ data, onChange }: Props) {
  const [input, setInput] = useState("");
  const add = () => { const s = input.trim(); if (s && !data.includes(s)) { onChange([...data, s]); setInput(""); } };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input className="flex-1 rounded-md border px-3 py-2 text-sm" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} placeholder="Type a skill and press Enter" />
        <button onClick={add} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.map((s) => (
          <span key={s} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm flex items-center gap-1">
            {s}
            <button onClick={() => onChange(data.filter(x => x !== s))} className="hover:text-destructive">×</button>
          </span>
        ))}
      </div>
      {data.length === 0 && <p className="text-sm text-muted-foreground">Add skills like "JavaScript", "Project Management", etc.</p>}
    </div>
  );
}
