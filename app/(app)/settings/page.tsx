"use client";

import { useState, useEffect } from "react";
import { getUser, getTier, setTier, Tier } from "@/lib/store";
import { LocalUser } from "@/lib/store";

export default function SettingsPage() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [tier, setTierState] = useState<Tier>("free");

  useEffect(() => {
    setUser(getUser());
    setTierState(getTier());
  }, []);

  const handleTierChange = (newTier: Tier) => {
    setTier(newTier);
    setTierState(newTier);
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Account</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Plan</h2>
        <div className="grid grid-cols-3 gap-3">
          {(["free", "full_access", "premium"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTierChange(t)}
              className={`border rounded-lg p-4 text-left ${tier === t ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
            >
              <div className="font-medium capitalize">{t.replace("_", " ")}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {t === "free" ? "1 resume, PDF only" : t === "full_access" ? "Unlimited, all formats" : "Everything + AI features"}
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">Change your plan anytime. Stored locally.</p>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Data</h2>
        <p className="text-sm text-muted-foreground mb-3">All data is stored in your browser. Clearing browser data will delete your resumes.</p>
        <button onClick={() => { if (confirm("Delete all resumes? This cannot be undone.")) { localStorage.clear(); window.location.href = "/"; } }} className="rounded-md border border-destructive text-destructive px-4 py-2 text-sm hover:bg-destructive/10">
          Clear All Data
        </button>
      </div>
    </div>
  );
}
