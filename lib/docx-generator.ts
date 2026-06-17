import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { Resume } from "./types";

export async function generateDocx(resume: Resume): Promise<Blob> {
  const { personalInfo, experience, education, skills, summary } = resume;
  const children: Paragraph[] = [];

  if (personalInfo.fullName) {
    children.push(new Paragraph({ children: [new TextRun({ text: personalInfo.fullName, bold: true, size: 32 })], alignment: AlignmentType.CENTER, spacing: { after: 100 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: [personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(" | "), size: 20 })], alignment: AlignmentType.CENTER, spacing: { after: 300 } }));
  }
  if (summary) {
    children.push(new Paragraph({ text: "SUMMARY", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: summary, size: 20 })], spacing: { after: 200 } }));
  }
  if (experience.length > 0) {
    children.push(new Paragraph({ text: "EXPERIENCE", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
    for (const exp of experience) {
      children.push(new Paragraph({ children: [new TextRun({ text: exp.title, bold: true, size: 22 }), new TextRun({ text: ` — ${exp.company}`, size: 22 })], spacing: { before: 100 } }));
      children.push(new Paragraph({ children: [new TextRun({ text: `${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`, size: 18, color: "666666", italics: true })] }));
      for (const b of exp.bullets.filter(Boolean)) {
        children.push(new Paragraph({ children: [new TextRun({ text: `• ${b}`, size: 20 })], indent: { left: 360 } }));
      }
    }
  }
  if (education.length > 0) {
    children.push(new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
    for (const edu of education) {
      children.push(new Paragraph({ children: [new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`, bold: true, size: 22 })] }));
      children.push(new Paragraph({ children: [new TextRun({ text: `${edu.school} | ${edu.startDate} – ${edu.endDate}`, size: 20, color: "666666" })] }));
    }
  }
  if (skills.length > 0) {
    children.push(new Paragraph({ text: "SKILLS", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: skills.join("  •  "), size: 20 })] }));
  }

  const doc = new Document({ sections: [{ children }] });
  return await Packer.toBlob(doc);
}
