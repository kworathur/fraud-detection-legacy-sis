export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  disabled,
}: Readonly<{
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "warning";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}>) {
  const variantClasses = {
    primary:
      "border-link-blue text-link-blue bg-white hover:bg-blue-50",
    secondary:
      "border-link-blue bg-link-blue text-white hover:bg-[#2b6cb0]",
    warning:
      "border-alert-red text-alert-red bg-white hover:bg-red-50",
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
    <button type="button" className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
