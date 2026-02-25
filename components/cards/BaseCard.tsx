export default function BaseCard({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={`flex h-[18.5rem] w-[19.6875rem] flex-col rounded-[0.25rem] bg-white py-[0.8125rem] shadow-[0_0_2rem_rgba(0,0,0,0.25)] ${className}`}
    >
      {children}
    </div>
  );
}
