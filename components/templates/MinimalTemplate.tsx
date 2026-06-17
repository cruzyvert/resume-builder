"use client";
import { Resume } from "@/lib/types";

export function MinimalTemplate({ resume }: { resume: Resume }) {
  const { personalInfo, experience, education, skills, summary } = resume;
  return (
    <div className="p-8 text-sm max-w-2xl mx-auto">
      {personalInfo.fullName && (
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight mb-1">{personalInfo.fullName}</h1>
          <div className="text-xs text-gray-400 flex flex-wrap gap-3">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>
      )}
      {summary && <p className="text-gray-500 mb-6 text-sm leading-relaxed">{summary}</p>}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <span className="font-medium">{exp.title}</span>
                <span className="text-[10px] text-gray-400">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
              </div>
              {exp.company && <p className="text-xs text-gray-400">{exp.company}</p>}
              {exp.bullets.filter(Boolean).map((b, i) => <p key={i} className="text-xs text-gray-500 mt-1">{b}</p>)}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between mb-1">
              <span className="text-sm">{edu.degree}{edu.field && ` in ${edu.field}`} — {edu.school}</span>
              <span className="text-[10px] text-gray-400">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Skills</h2>
          <p className="text-xs text-gray-500">{skills.join(" · ")}</p>
        </div>
      )}
    </div>
  );
}
