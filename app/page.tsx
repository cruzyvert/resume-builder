import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-5xl font-bold mb-6">Build a Professional Resume</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Create, edit, and download resumes in PDF, Word, or plain text. Three beautiful templates. ATS scoring. Free to use.
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Get Started — It's Free
          </Link>
        </div>
      </div>
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-semibold mb-2">Guided Wizard</h3>
              <p className="text-sm text-muted-foreground">Step-by-step resume builder. We guide you through every section.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">👁️</div>
              <h3 className="font-semibold mb-2">Live Preview</h3>
              <p className="text-sm text-muted-foreground">See your resume update in real-time as you type. Three templates to choose from.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📥</div>
              <h3 className="font-semibold mb-2">Multiple Formats</h3>
              <p className="text-sm text-muted-foreground">Download as PDF, Word (.docx), or plain text. Whatever the employer needs.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold mb-2">ATS Scoring</h3>
              <p className="text-sm text-muted-foreground">Get an ATS compatibility score with actionable tips to improve your resume.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold mb-2">AI Suggestions</h3>
              <p className="text-sm text-muted-foreground">Generate bullet points and improve your writing with rule-based AI assistance.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold mb-2">Private & Local</h3>
              <p className="text-sm text-muted-foreground">All data stays in your browser. Nothing is sent to any server.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
