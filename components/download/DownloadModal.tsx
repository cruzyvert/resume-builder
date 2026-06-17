"use client";

import { useState } from "react";
import { Resume } from "@/lib/types";
import { generatePDF } from "@/lib/pdf-generator"; // .tsx resolved automatically
import { generateDocx } from "@/lib/docx-generator";
import { generateTxt } from "@/lib/txt-generator";

interface Props { resume: Resume; }

export function DownloadModal({ resume }: Props) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const download = async (format: "pdf" | "docx" | "txt") => {
    setDownloading(format);
    try {
      let blob: Blob;
      let filename: string;
      switch (format) {
        case "pdf": blob = await generatePDF(resume); filename = `${resume.title}.pdf`; break;
        case "docx": blob = await generateDocx(resume); filename = `${resume.title}.docx`; break;
        case "txt": blob = new Blob([generateTxt(resume)], { type: "text/plain" }); filename = `${resume.title}.txt`; break;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch { alert("Download failed. Please try again."); }
    finally { setDownloading(null); setOpen(false); }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted">Download</button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setOpen(false)}>
          <div className="bg-background rounded-lg p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-4">Choose Format</h3>
            <div className="space-y-2">
              {(["pdf", "docx", "txt"] as const).map((f) => (
                <button key={f} onClick={() => download(f)} disabled={downloading !== null} className="w-full rounded-md border px-4 py-2 text-sm text-left hover:bg-muted disabled:opacity-50">
                  {downloading === f ? "Generating..." : f === "pdf" ? "PDF" : f === "docx" ? "Word (.docx)" : "Plain Text (.txt)"}
                </button>
              ))}
            </div>
            <button onClick={() => setOpen(false)} className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
