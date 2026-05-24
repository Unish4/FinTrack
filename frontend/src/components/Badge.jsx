function Badge({ variant = "default", size = "sm", children }) {
  const variants = {
    income: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
    expense: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    default: "bg-slate-800/50 text-slate-300 border border-slate-700",
    indigo: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  };

  const sizes = {
    sm: "text-[13px] px-2.5 py-0.5",
    md: "text-sm px-3 py-1",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium
                      ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}

export default Badge;
