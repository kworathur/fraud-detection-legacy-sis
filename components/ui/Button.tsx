export default function Button({
  children,
  href,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  href?: string;
  className?: string;
}>) {
  const baseClasses =
    "inline-flex h-[32px] items-center justify-center rounded-[5px] border border-[#3182ce] px-4 py-[8px] font-[family-name:var(--font-akshar)] text-[13px] font-semibold text-[#3182ce] whitespace-nowrap hover:bg-blue-50 transition-colors";

  if (href) {
    return (
      <a href={href} className={`${baseClasses} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
}
