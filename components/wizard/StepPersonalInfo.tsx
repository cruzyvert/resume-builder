"use client";
import { PersonalInfo } from "@/lib/types";

interface Props { data: PersonalInfo; onChange: (d: PersonalInfo) => void; }

export function StepPersonalInfo({ data, onChange }: Props) {
  const update = (field: keyof PersonalInfo, value: string) => onChange({ ...data, [field]: value });
  return (
    <div className="space-y-3">
      {(["fullName", "email", "phone", "location", "linkedin"] as const).map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium mb-1 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
          <input className="w-full rounded-md border border-input px-3 py-2 text-sm" value={data[field]} onChange={(e) => update(field, e.target.value)} placeholder={field === "fullName" ? "John Doe" : field === "email" ? "john@example.com" : ""} />
        </div>
      ))}
    </div>
  );
}
