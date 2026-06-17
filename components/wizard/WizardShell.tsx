"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_RESUME, Resume, Experience, Education } from "@/lib/types";
import { createResume } from "@/lib/store";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepExperience } from "./StepExperience";
import { StepEducation } from "./StepEducation";
import { StepSkills } from "./StepSkills";
import { StepSummary } from "./StepSummary";
import { StepReview } from "./StepReview";

const STEPS = ["Personal", "Experience", "Education", "Skills", "Summary", "Review"];

export function WizardShell() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("My Resume");
  const [personalInfo, setPersonalInfo] = useState(DEFAULT_RESUME.personalInfo);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [summary, setSummary] = useState("");

  const handleSave = () => {
    const resume = createResume({
      title,
      templateId: "classic",
      personalInfo,
      experience,
      education,
      skills,
      summary,
    });
    router.push(`/resumes/edit?id=${resume.id}`);
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <StepPersonalInfo data={personalInfo} onChange={setPersonalInfo} />;
      case 1: return <StepExperience data={experience} onChange={setExperience} />;
      case 2: return <StepEducation data={education} onChange={setEducation} />;
      case 3: return <StepSkills data={skills} onChange={setSkills} />;
      case 4: return <StepSummary data={summary} onChange={setSummary} />;
      case 5: return (
        <StepReview
          title={title}
          setTitle={setTitle}
          personalInfo={personalInfo}
          experience={experience}
          education={education}
          skills={skills}
          summary={summary}
          onSave={handleSave}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex gap-1 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className={`flex-1 text-center text-xs py-2 rounded ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary/20" : "bg-muted"}`}>
            {label}
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{STEPS[step]}</h2>
        {renderStep()}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="rounded-md border px-4 py-2 text-sm disabled:opacity-50">Back</button>
          {step < 5 ? (
            <button onClick={() => setStep(s => s + 1)} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">Next</button>
          ) : (
            <button onClick={handleSave} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">Save Resume</button>
          )}
        </div>
      </div>
    </div>
  );
}
