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
    <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${accentClass}`}>{value}</p>
    </div>
  );
}