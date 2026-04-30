"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  ScrollText,
  Search,
  Users,
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

interface PageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isActive: (pathname: string, searchParams: URLSearchParams) => boolean;
}

function getNavItems(pathname: string): NavItem[] {
  if (pathname.startsWith("/admin")) {
    return [
      {
        href: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
        isActive: (currentPath, searchParams) =>
          currentPath === "/admin" && searchParams.get("section") !== "obligations",
      },
      {
        href: "/admin?section=obligations",
        label: "Obligaciones",
        icon: ClipboardList,
        isActive: (currentPath, searchParams) =>
          currentPath === "/admin" && searchParams.get("section") === "obligations",
      },
      {
        href: "/admin/users",
        label: "Usuarios",
        icon: Users,
        isActive: (currentPath) =>
          currentPath === "/admin/users" || currentPath.startsWith("/admin/users/"),
      },
      {
        href: "/admin/organizations",
        label: "Organizaciones",
        icon: Building2,
        isActive: (currentPath) =>
          currentPath === "/admin/organizations" ||
          currentPath.startsWith("/admin/organizations/"),
      },
      {
        href: "/admin/titles",
        label: "Títulos",
        icon: ScrollText,
        isActive: (currentPath) =>
          currentPath === "/admin/titles" || currentPath.startsWith("/admin/titles/"),
      },
    ];
  }

  if (pathname.startsWith("/specialist")) {
    return [
      {
        href: "/specialist?view=general",
        label: "Dashboard",
        icon: LayoutDashboard,
        isActive: (currentPath, searchParams) =>
          currentPath === "/specialist" &&
          (searchParams.get("view") === "general" || !searchParams.get("view")),
      },
      {
        href: "/specialist?view=obligations",
        label: "Obligaciones",
        icon: ClipboardList,
        isActive: (currentPath, searchParams) =>
          currentPath === "/specialist/obligations" ||
          currentPath.startsWith("/specialist/obligations/") ||
          (currentPath === "/specialist" && searchParams.get("view") === "obligations"),
      },
    ];
  }

  if (pathname.startsWith("/client")) {
    return [
      {
        href: "/client?view=general",
        label: "Dashboard",
        icon: LayoutDashboard,
        isActive: (currentPath, searchParams) =>
          currentPath === "/client" &&
          (searchParams.get("view") === "general" || !searchParams.get("view")),
      },
      {
        href: "/client?view=obligations",
        label: "Obligaciones",
        icon: ClipboardList,
        isActive: (currentPath, searchParams) =>
          currentPath === "/client/obligations" ||
          currentPath.startsWith("/client/obligations/") ||
          (currentPath === "/client" && searchParams.get("view") === "obligations"),
      },
    ];
  }

  return [];
}

export function PageShell({ title, description, children }: PageShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navItems = getNavItems(pathname);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-slate-800/80 bg-slate-950/95 xl:flex xl:flex-col">
          <div className="border-b border-slate-800/80 px-5 py-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-300">
              Seguimiento minero
            </p>
            <h1 className="mt-2 text-xl font-bold text-white">Panel web</h1>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Gestión centralizada de obligaciones, títulos y usuarios.
            </p>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-5">
            {navItems.map((item) => {
              const active = item.isActive(pathname, searchParams);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-emerald-500 text-slate-950 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]"
                      : "text-slate-200 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Icon
                    size={18}
                    className={active ? "opacity-100" : "opacity-80 group-hover:opacity-100"}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-800/80 px-4 py-4">
            <LogoutButton />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-4">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold">{title}</h1>
                <p className="mt-1 max-w-4xl truncate text-sm text-slate-400">
                  {description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2.5 lg:flex">
                  <Search size={16} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Búsqueda global"
                    className="w-56 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>

                <div className="hidden rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-300 lg:block">
                  Sesión activa
                </div>

                <div className="xl:hidden">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </header>

          <section className="mx-auto w-full max-w-[1600px] flex-1 px-6 py-6">
            <div className="space-y-5">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}