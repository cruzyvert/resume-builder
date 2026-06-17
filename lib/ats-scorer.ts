import { Resume } from "./types";

const ACTION_VERBS = ["achieved","administered","advanced","analyzed","built","chaired","coached","compiled","composed","conducted","consolidated","constructed","coordinated","created","decreased","delivered","designed","developed","directed","drove","eliminated","engineered","established","evaluated","executed","expanded","facilitated","founded","generated","grew","headed","identified","implemented","improved","increased","influenced","initiated","innovated","introduced","launched","led","managed","mentored","negotiated","optimized","organized","oversaw","pioneered","planned","produced","reduced","reorganized","resolved","restructured","revamped","scaled","spearheaded","streamlined","strengthened","supervised","surpassed","transformed","unified","won"];

export interface AtsResult { score: number; tips: string[]; }

export function scoreResume(resume: Resume): AtsResult {
  const tips: string[] = [];
  let score = 0;

  // Contact info (15 pts)
  if (resume.personalInfo.fullName) score += 5; else tips.push("Add your full name");
  if (resume.personalInfo.email) score += 5; else tips.push("Add your email address");
  if (resume.personalInfo.phone) score += 5; else tips.push("Add your phone number");

  // Sections (20 pts)
  if (resume.experience.length > 0) score += 8; else tips.push("Add an Experience section");
  if (resume.education.length > 0) score += 6; else tips.push("Add an Education section");
  if (resume.skills.length > 0) score += 6; else tips.push("Add a Skills section");

  // Action verbs (25 pts)
  let totalBullets = 0, verbBullets = 0;
  for (const exp of resume.experience) {
    for (const b of exp.bullets) {
      totalBullets++;
      const first = b.trim().split(" ")[0]?.toLowerCase() ?? "";
      if (ACTION_VERBS.includes(first)) verbBullets++;
    }
  }
  if (totalBullets > 0) {
    score += Math.round((verbBullets / totalBullets) * 25);
    if (verbBullets / totalBullets < 0.5) tips.push(`Start more bullets with action verbs (${verbBullets}/${totalBullets} do)`);
  } else tips.push("Add bullet points to your experience");

  // Metrics (20 pts)
  let metricBullets = 0;
  for (const exp of resume.experience) {
    for (const b of exp.bullets) {
      if (/\d+%|\d+\+|\$\d+|\d+ percent|\d+ people|\d+ team/i.test(b)) metricBullets++;
    }
  }
  if (totalBullets > 0) {
    score += Math.round((metricBullets / totalBullets) * 20);
    if (metricBullets / totalBullets < 0.3) tips.push("Add numbers, percentages, or dollar amounts to your bullets");
  }

  // Summary (10 pts)
  if (resume.summary) score += 10; else tips.push("Consider adding a professional summary");

  // Length (10 pts)
  if (resume.experience.length >= 2) score += 10; else if (resume.experience.length === 1) { score += 5; tips.push("Add more experience entries if possible"); }

  return { score: Math.min(score, 100), tips: tips.slice(0, 5) };
}
