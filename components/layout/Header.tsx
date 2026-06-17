"use client";

import Link from "next/link";
import { getUser, signOut, getTier } from "@/lib/store";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const user = getUser();
  const tier = getTier();

  if (!user) return null;

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-bold">ResumeBuilder</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/settings" className="hover:underline">Settings</Link>
          <span className="text-muted-foreground">{user.name}</span>
          <span className="text-xs bg-secondary px-2 py-0.5 rounded capitalize">{tier.replace("_", " ")}</span>
          <button onClick={() => { signOut(); router.push("/"); }} className="text-muted-foreground hover:text-foreground">
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
}
