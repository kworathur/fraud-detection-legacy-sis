import Image from "next/image";

export default function CardHeader({
  title,
  actions,
}: Readonly<{
  title: string;
  actions?: React.ReactNode;
}>) {
  return (
    <div className="flex shrink-0 items-center gap-[2.5625rem] px-[0.875rem]">
      <p className="w-[12.25rem] font-sans text-[0.9375rem] font-semibold tracking-[0.0375rem] text-[#292929]">
        {title}
      </p>
      {actions ?? (
        <div className="flex items-center gap-[0.4375rem]">
          <button
            type="button"
            className="flex h-[1.5rem] w-[1.5rem] items-center justify-center"
          >
            <Image src="/images/more-vert.svg" alt="" width={3} height={11} />
          </button>
          <button
            type="button"
            className="flex h-[1.5rem] w-[1.5rem] items-center justify-center"
          >
            <Image src="/images/bookmark.svg" alt="" width={14} height={18} />
          </button>
        </div>
      )}
    </div>
  );
}
