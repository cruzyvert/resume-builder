"use client";
import { Resume } from "@/lib/types";

export function ModernTemplate({ resume }: { resume: Resume }) {
  const { personalInfo, experience, education, skills, summary } = resume;
  return (
    <div className="flex text-sm min-h-[600px]">
      <div className="w-1/3 bg-slate-800 text-white p-6 space-y-6">
        <h1 className="text-xl font-bold">{personalInfo.fullName || "Your Name"}</h1>
        <div className="text-xs space-y-1 text-slate-300">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
        </div>
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((s) => <span key={s} className="bg-slate-700 px-2 py-0.5 rounded text-xs">{s}</span>)}
            </div>
          </div>
        )}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 text-xs">
                <p className="font-medium">{edu.degree}{edu.field && ` in ${edu.field}`}</p>
                <p className="text-slate-400">{edu.school}</p>
                <p className="text-slate-500">{edu.startDate} – {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 p-6 space-y-5">
        {summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-800 pb-1 mb-2">Summary</h2>
            <p className="text-gray-600 text-sm">{summary}</p>
          </div>
        )}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-800 pb-1 mb-2">Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between">
                  <span className="font-bold">{exp.title}</span>
                  <span className="text-xs text-gray-400">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                </div>
                {exp.company && <p className="text-xs text-slate-600">{exp.company}</p>}
                {exp.bullets.filter(Boolean).map((b, i) => <p key={i} className="text-gray-600 text-xs ml-3">• {b}</p>)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
