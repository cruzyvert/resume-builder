"use client";
import { Resume } from "@/lib/types";

export function ClassicTemplate({ resume }: { resume: Resume }) {
  const { personalInfo, experience, education, skills, summary } = resume;
  return (
    <div className="p-8 font-serif text-sm leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
      {personalInfo.fullName && (
        <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
          <h1 className="text-2xl font-bold mb-1">{personalInfo.fullName}</h1>
          <div className="text-xs text-gray-500 space-x-3">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </div>
      )}
      {summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Summary</h2>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between">
                <span className="font-bold">{exp.title}{exp.company && <span className="font-normal text-gray-600"> — {exp.company}</span>}</span>
                <span className="text-xs text-gray-400">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
              </div>
              {exp.bullets.filter(Boolean).map((b, i) => <p key={i} className="text-gray-600 ml-4">• {b}</p>)}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between mb-1">
              <span><strong>{edu.degree}</strong>{edu.field && ` in ${edu.field}`}{edu.school && ` — ${edu.school}`}</span>
              <span className="text-xs text-gray-400">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Skills</h2>
          <p className="text-gray-700">{skills.join(" · ")}</p>
        </div>
      )}
    </div>
  );
}
