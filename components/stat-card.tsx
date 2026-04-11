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
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className={`mt-3 text-4xl font-bold ${accentClass}`}>{value}</p>
    </div>
  );
}