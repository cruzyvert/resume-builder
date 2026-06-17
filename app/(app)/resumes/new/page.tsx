"use client";
import { WizardShell } from "@/components/wizard/WizardShell";

export default function NewResumePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Create New Resume</h1>
      <p className="text-muted-foreground mb-8">Follow the steps to build your resume</p>
      <WizardShell />
    </div>
  );
}
