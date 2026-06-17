"use client";

interface Props { data: string; onChange: (d: string) => void; }

export function StepSummary({ data, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Professional Summary</label>
      <textarea className="w-full min-h-[120px] rounded-md border px-3 py-2 text-sm" value={data} onChange={(e) => onChange(e.target.value)} placeholder="Brief overview of your professional background and key strengths..." />
    </div>
  );
}
