"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getResume } from "@/lib/store";
import { Resume } from "@/lib/types";
import { DownloadModal } from "@/components/download/DownloadModal";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";

function ViewResumeInner() {
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

  if (!resume) return <div className="text-center py-16">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{resume.title}</h1>
        <div className="flex gap-2">
          <DownloadModal resume={resume} />
          <button onClick={() => router.push(`/resumes/edit?id=${resume.id}`)} className="rounded-md border px-4 py-2 text-sm hover:bg-muted">Edit</button>
        </div>
      </div>
      <div className="border rounded-lg bg-white shadow-sm">
        <ClassicTemplate resume={resume} />
      </div>
    </div>
  );
}

export default function ViewResumePage() {
  return (
    <Suspense fallback={<div className="text-center py-16">Loading...</div>}>
      <ViewResumeInner />
    </Suspense>
  );
}
