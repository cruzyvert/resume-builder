"use client";

import { useState } from "react";
import { Resume } from "@/lib/types";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { DownloadModal } from "@/components/download/DownloadModal";

interface Props { resume: Resume; onSave: (r: Resume) => void; }

const TEMPLATE_COMPONENTS: Record<string, React.FC<{ resume: Resume }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
};

export function EditorShell({ resume, onSave }: Props) {
  const [data, setData] = useState<Resume>(resume);
  const [saved, setSaved] = useState(false);

  const update = (partial: Partial<Resume>) => setData((prev) => ({ ...prev, ...partial }));

  const handleSave = () => {
    onSave(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const TemplateComp = TEMPLATE_COMPONENTS[data.templateId] || ClassicTemplate;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <input className="rounded-md border px-3 py-1.5 text-sm w-48" value={data.title} onChange={(e) => update({ title: e.target.value })} />
          <select className="rounded-md border px-2 py-1.5 text-sm" value={data.templateId} onChange={(e) => update({ templateId: e.target.value as Resume["templateId"] })}>
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>
        <div className="flex gap-2">
          <DownloadModal resume={data} />
          <button onClick={handleSave} className="rounded-md bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:bg-primary/90">
            {saved ? "✓ Saved" : "Save"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor form */}
        <div className="space-y-4 border rounded-lg p-4">
          <h3 className="font-semibold text-sm">Personal Info</h3>
          {(["fullName", "email", "phone", "location", "linkedin"] as const).map((field) => (
            <div key={field}>
              <label className="block text-xs font-medium mb-1 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
              <input className="w-full rounded border px-2 py-1 text-sm" value={data.personalInfo[field]} onChange={(e) => update({ personalInfo: { ...data.personalInfo, [field]: e.target.value } })} />
            </div>
          ))}

          <h3 className="font-semibold text-sm pt-2">Summary</h3>
          <textarea className="w-full min-h-[80px] rounded border px-2 py-1 text-sm" value={data.summary} onChange={(e) => update({ summary: e.target.value })} />

          <h3 className="font-semibold text-sm pt-2">Skills (comma-separated)</h3>
          <input className="w-full rounded border px-2 py-1 text-sm" value={data.skills.join(", ")} onChange={(e) => update({ skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />

          <h3 className="font-semibold text-sm pt-2">Experience</h3>
          {data.experience.map((exp, i) => (
            <div key={exp.id} className="border rounded p-2 space-y-1">
              <div className="flex justify-between"><span className="text-xs font-medium">#{i + 1}</span><button onClick={() => update({ experience: data.experience.filter((_, idx) => idx !== i) })} className="text-xs text-destructive">Remove</button></div>
              <input className="w-full rounded border px-2 py-1 text-xs" placeholder="Title" value={exp.title} onChange={(e) => { const u = [...data.experience]; u[i] = { ...u[i], title: e.target.value }; update({ experience: u }); }} />
              <input className="w-full rounded border px-2 py-1 text-xs" placeholder="Company" value={exp.company} onChange={(e) => { const u = [...data.experience]; u[i] = { ...u[i], company: e.target.value }; update({ experience: u }); }} />
              {exp.bullets.map((b, j) => (
                <input key={j} className="w-full rounded border px-2 py-1 text-xs" placeholder="Bullet" value={b} onChange={(e) => { const u = [...data.experience]; const b2 = [...u[i].bullets]; b2[j] = e.target.value; u[i] = { ...u[i], bullets: b2 }; update({ experience: u }); }} />
              ))}
              <button onClick={() => { const u = [...data.experience]; u[i] = { ...u[i], bullets: [...u[i].bullets, ""] }; update({ experience: u }); }} className="text-xs text-primary">+ Add Bullet</button>
            </div>
          ))}
          <button onClick={() => update({ experience: [...data.experience, { id: crypto.randomUUID(), company: "", title: "", startDate: "", endDate: "", current: false, bullets: [""] }] })} className="w-full rounded border border-dashed py-1.5 text-xs text-muted-foreground">+ Add Experience</button>

          <h3 className="font-semibold text-sm pt-2">Education</h3>
          {data.education.map((edu, i) => (
            <div key={edu.id} className="border rounded p-2 space-y-1">
              <div className="flex justify-between"><span className="text-xs font-medium">#{i + 1}</span><button onClick={() => update({ education: data.education.filter((_, idx) => idx !== i) })} className="text-xs text-destructive">Remove</button></div>
              <input className="w-full rounded border px-2 py-1 text-xs" placeholder="School" value={edu.school} onChange={(e) => { const u = [...data.education]; u[i] = { ...u[i], school: e.target.value }; update({ education: u }); }} />
              <div className="grid grid-cols-2 gap-1">
                <input className="rounded border px-2 py-1 text-xs" placeholder="Degree" value={edu.degree} onChange={(e) => { const u = [...data.education]; u[i] = { ...u[i], degree: e.target.value }; update({ education: u }); }} />
                <input className="rounded border px-2 py-1 text-xs" placeholder="Field" value={edu.field} onChange={(e) => { const u = [...data.education]; u[i] = { ...u[i], field: e.target.value }; update({ education: u }); }} />
              </div>
            </div>
          ))}
          <button onClick={() => update({ education: [...data.education, { id: crypto.randomUUID(), school: "", degree: "", field: "", startDate: "", endDate: "" }] })} className="w-full rounded border border-dashed py-1.5 text-xs text-muted-foreground">+ Add Education</button>
        </div>

        {/* Live preview */}
        <div className="border rounded-lg bg-white shadow-sm overflow-hidden sticky top-4">
          <TemplateComp resume={data} />
        </div>
      </div>
    </div>
  );
}
