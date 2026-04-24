interface StatCardProps {
  title: string;
  value: string | number;
  accentClass?: string;
}

export function StatCard({
  title,
  value,
  accentClass = "text-white",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {title}
      </p>
      <p className={`mt-1 text-2xl font-bold ${accentClass}`}>{value}</p>
    </div>
  );
}