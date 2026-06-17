"use client";
import { Education } from "@/lib/types";

interface Props { data: Education[]; onChange: (d: Education[]) => void; }

export function StepEducation({ data, onChange }: Props) {
  const add = () => onChange([...data, { id: crypto.randomUUID(), school: "", degree: "", field: "", startDate: "", endDate: "" }]);
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Education, value: string) => { const u = [...data]; u[i] = { ...u[i], [field]: value }; onChange(u); };
  return (
    <div className="space-y-4">
      {data.map((edu, i) => (
        <div key={edu.id} className="border rounded p-3 space-y-2">
          <div className="flex justify-between"><span className="text-sm font-medium">Education {i + 1}</span><button onClick={() => remove(i)} className="text-xs text-destructive">Remove</button></div>
          <input className="w-full rounded border px-2 py-1 text-sm" placeholder="School" value={edu.school} onChange={(e) => update(i, "school", e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded border px-2 py-1 text-sm" placeholder="Degree" value={edu.degree} onChange={(e) => update(i, "degree", e.target.value)} />
            <input className="rounded border px-2 py-1 text-sm" placeholder="Field of Study" value={edu.field} onChange={(e) => update(i, "field", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded border px-2 py-1 text-sm" placeholder="Start" value={edu.startDate} onChange={(e) => update(i, "startDate", e.target.value)} />
            <input className="rounded border px-2 py-1 text-sm" placeholder="End" value={edu.endDate} onChange={(e) => update(i, "endDate", e.target.value)} />
          </div>
        </div>
      ))}
      <button onClick={add} className="w-full rounded border border-dashed py-2 text-sm text-muted-foreground hover:bg-muted">+ Add Education</button>
    </div>
  );
}
