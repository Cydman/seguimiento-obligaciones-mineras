import type { ReactNode } from "react";
import { LogoutButton } from "@/components/logout-button";

interface PageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">{title}</h1>
            <p className="mt-4 max-w-3xl text-slate-300">{description}</p>
          </div>

          <LogoutButton />
        </div>

        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}