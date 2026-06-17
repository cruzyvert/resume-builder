"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getResumes, deleteResume, getResumeCount, hasTierAccess } from "@/lib/store";
import { Resume } from "@/lib/types";
import { DownloadModal } from "@/components/download/DownloadModal";

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => { setResumes(getResumes()); }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Delete this resume?")) return;
    deleteResume(id);
    setResumes(getResumes());
  };

  const canCreate = hasTierAccess("full_access") || getResumeCount() < 1;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <Link
          href="/resumes/new"
          className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-primary-foreground ${canCreate ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
        >
          + New Resume
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <p className="text-muted-foreground mb-4">No resumes yet. Create your first one!</p>
          <Link href="/resumes/new" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Create Resume
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((resume) => (
            <div key={resume.id} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{resume.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {resume.personalInfo.fullName || "Untitled"} · Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <DownloadModal resume={resume} />
                <Link href={`/resumes/edit?id=${resume.id}`} className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted">Edit</Link>
                <button onClick={() => handleDelete(resume.id)} className="rounded-md border px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
