export default function BaseCard({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={`flex h-[296px] w-[315px] flex-col gap-[10px] rounded bg-white py-[13px] shadow-[0_0_32px_rgba(0,0,0,0.25)] ${className}`}
    >
      {children}
    </div>
  );
}
