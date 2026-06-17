"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getResume, saveResume } from "@/lib/store";
import { Resume } from "@/lib/types";
import { EditorShell } from "@/components/editor/EditorShell";

function EditResumeInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const r = getResume(id);
      if (r) { setResume(r); return; }
    }
    router.push("/dashboard");
  }, [searchParams]);

  const handleSave = (updated: Resume) => {
    saveResume(updated);
    setResume(updated);
  };

  if (!resume) return <div className="text-center py-16">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Resume</h1>
      <EditorShell resume={resume} onSave={handleSave} />
    </div>
  );
}

export default function EditResumePage() {
  return (
    <Suspense fallback={<div className="text-center py-16">Loading...</div>}>
      <EditResumeInner />
    </Suspense>
  );
}
