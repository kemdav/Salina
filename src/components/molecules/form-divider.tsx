interface FormDividerProps {
  label: string;
}

export function FormDivider({ label }: FormDividerProps) {
  return (
    <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.06em] text-[var(--muted)]">
      <span className="h-px flex-1 bg-[#E5E7EB]" />
      {label}
      <span className="h-px flex-1 bg-[#E5E7EB]" />
    </div>
  );
}
