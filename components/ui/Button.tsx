export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
}: Readonly<{
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "warning";
  className?: string;
}>) {
  const variantClasses = {
    primary:
      "border-[#3182ce] text-[#3182ce] bg-white hover:bg-blue-50",
    secondary:
      "border-[#3182ce] bg-[#3182ce] text-white hover:bg-[#2b6cb0]",
    warning:
      "border-[#b91c1c] text-[#b91c1c] bg-white hover:bg-red-50",
  };

  const baseClasses =
    "inline-flex h-[2rem] items-center justify-center rounded-[0.3125rem] border px-4 py-[0.5rem] font-[family-name:var(--font-akshar)] text-[0.8125rem] font-semibold whitespace-nowrap transition-colors";

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes}>
      {children}
    </button>
  );
}
