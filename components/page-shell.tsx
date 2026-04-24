"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

function getNavItems(pathname: string) {
  if (pathname.startsWith("/admin")) {
    return [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin", label: "Obligaciones", icon: ClipboardList },
      { href: "/admin/users", label: "Usuarios", icon: Users },
      { href: "/admin/organizations", label: "Organizaciones", icon: Building2 },
      { href: "/admin/titles", label: "Títulos", icon: ScrollText },
    ];
  }

  if (pathname.startsWith("/specialist")) {
    return [
      { href: "/specialist", label: "Dashboard", icon: LayoutDashboard },
      { href: "/specialist", label: "Obligaciones", icon: ClipboardList },
    ];
  }

  return [
    { href: "/client", label: "Dashboard", icon: LayoutDashboard },
    { href: "/client", label: "Obligaciones", icon: ClipboardList },
  ];
}

export function PageShell({ title, description, children }: PageShellProps) {
  const pathname = usePathname();
  const navItems = getNavItems(pathname);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950/90 xl:flex xl:flex-col">
          <div className="border-b border-slate-800 px-5 py-5">
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">
              Seguimiento minero
            </p>
            <h1 className="mt-2 text-xl font-bold text-white">Panel web</h1>
            <p className="mt-1 text-sm text-slate-400">
              Gestión centralizada de obligaciones y usuarios.
            </p>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-5">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-emerald-500 text-slate-950"
                      : "text-slate-200 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-800 px-4 py-4">
            <LogoutButton />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-4">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold">{title}</h1>
                <p className="mt-1 truncate text-sm text-slate-400">
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
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}