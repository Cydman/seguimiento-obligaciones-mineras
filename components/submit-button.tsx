"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  idleLabel?: string;
  pendingLabel?: string;
  className?: string;
}

export function SubmitButton({
  idleLabel = "Guardar",
  pendingLabel = "Guardando...",
  className = "",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}