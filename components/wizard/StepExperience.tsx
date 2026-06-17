"use client";
import { Experience } from "@/lib/types";

interface Props { data: Experience[]; onChange: (d: Experience[]) => void; }

export function StepExperience({ data, onChange }: Props) {
  const add = () => onChange([...data, { id: crypto.randomUUID(), company: "", title: "", startDate: "", endDate: "", current: false, bullets: [""] }]);
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Experience, value: unknown) => {
    const u = [...data]; u[i] = { ...u[i], [field]: value }; onChange(u);
  };
  return (
    <div className="space-y-4">
      {data.map((exp, i) => (
        <div key={exp.id} className="border rounded p-3 space-y-2">
          <div className="flex justify-between"><span className="text-sm font-medium">Experience {i + 1}</span><button onClick={() => remove(i)} className="text-xs text-destructive">Remove</button></div>
          <input className="w-full rounded border px-2 py-1 text-sm" placeholder="Job Title" value={exp.title} onChange={(e) => update(i, "title", e.target.value)} />
          <input className="w-full rounded border px-2 py-1 text-sm" placeholder="Company" value={exp.company} onChange={(e) => update(i, "company", e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded border px-2 py-1 text-sm" placeholder="Start Date" value={exp.startDate} onChange={(e) => update(i, "startDate", e.target.value)} />
            <input className="rounded border px-2 py-1 text-sm" placeholder="End Date" value={exp.endDate} onChange={(e) => update(i, "endDate", e.target.value)} disabled={exp.current} />
          </div>
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={exp.current} onChange={(e) => update(i, "current", e.target.checked)} /> Currently working here</label>
          {exp.bullets.map((b, j) => (
            <input key={j} className="w-full rounded border px-2 py-1 text-sm" placeholder="Bullet point" value={b} onChange={(e) => { const b2 = [...exp.bullets]; b2[j] = e.target.value; update(i, "bullets", b2); }} />
          ))}
          <button onClick={() => update(i, "bullets", [...exp.bullets, ""])} className="text-xs text-primary">+ Add Bullet</button>
        </div>
      ))}
      <button onClick={add} className="w-full rounded border border-dashed py-2 text-sm text-muted-foreground hover:bg-muted">+ Add Experience</button>
    </div>
  );
}
