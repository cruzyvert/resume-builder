"use client";
import { PersonalInfo, Experience, Education } from "@/lib/types";

interface Props {
  title: string; setTitle: (t: string) => void;
  personalInfo: PersonalInfo; experience: Experience[]; education: Education[];
  skills: string[]; summary: string; onSave: () => void;
}

export function StepReview({ title, setTitle, personalInfo, experience, education, skills, summary, onSave }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Resume Title</label>
        <input className="w-full rounded-md border px-3 py-2 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="text-sm space-y-2">
        <p><strong>Name:</strong> {personalInfo.fullName || "—"}</p>
        <p><strong>Email:</strong> {personalInfo.email || "—"}</p>
        <p><strong>Experience:</strong> {experience.length} entries</p>
        <p><strong>Education:</strong> {education.length} entries</p>
        <p><strong>Skills:</strong> {skills.join(", ") || "None"}</p>
        {summary && <p><strong>Summary:</strong> {summary}</p>}
      </div>
    </div>
  );
}
