function Badge({ variant = "default", size = "sm", children }) {
  const variants = {
    income: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    expense: "bg-red-50 text-red-600 border border-red-100",
    default: "bg-gray-100 text-gray-600 border border-gray-200",
    indigo: "bg-indigo-50 text-indigo-700 border border-indigo-100",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
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
