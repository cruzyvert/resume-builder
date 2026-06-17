import { Resume } from "./types";

export function generateTxt(resume: Resume): string {
  const lines: string[] = [];
  const d = "─────────────────────────────────";
  const { personalInfo, experience, education, skills, summary } = resume;

  if (personalInfo.fullName) {
    lines.push(personalInfo.fullName.toUpperCase());
    lines.push([personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(" | "));
    if (personalInfo.linkedin) lines.push(personalInfo.linkedin);
    lines.push("");
  }
  if (summary) { lines.push(d); lines.push("SUMMARY"); lines.push(d); lines.push(summary); lines.push(""); }
  if (experience.length > 0) { lines.push(d); lines.push("EXPERIENCE"); lines.push(d); for (const exp of experience) { lines.push(`${exp.title} at ${exp.company}`); lines.push(`${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`); for (const b of exp.bullets.filter(Boolean)) lines.push(`  • ${b}`); lines.push(""); } }
  if (education.length > 0) { lines.push(d); lines.push("EDUCATION"); lines.push(d); for (const edu of education) { lines.push(`${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`); lines.push(`${edu.school} | ${edu.startDate} – ${edu.endDate}`); lines.push(""); } }
  if (skills.length > 0) { lines.push(d); lines.push("SKILLS"); lines.push(d); lines.push(skills.join(" • ")); }

  return lines.join("\n");
}
