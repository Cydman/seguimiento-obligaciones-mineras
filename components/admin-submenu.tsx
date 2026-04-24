"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Obligaciones" },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/organizations", label: "Organizaciones" },
  { href: "/admin/titles", label: "Títulos" },
];

export function AdminSubmenu() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-3">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
              active
                ? "bg-emerald-500 text-slate-950"
                : "border border-slate-700 text-white hover:border-slate-500"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}