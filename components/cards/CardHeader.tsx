import Image from "next/image";

export default function CardHeader({
  title,
  actions,
}: Readonly<{
  title: string;
  actions?: React.ReactNode;
}>) {
  return (
    <div className="flex shrink-0 items-center gap-[41px] px-[14px]">
      <p className="w-[196px] font-sans text-[15px] font-semibold tracking-[0.6px] text-[#292929]">
        {title}
      </p>
      {actions ?? (
        <div className="flex items-center gap-[7px]">
          <button type="button" className="flex h-6 w-6 items-center justify-center">
            <Image src="/images/more-vert.svg" alt="" width={3} height={11} />
          </button>
          <button type="button" className="flex h-6 w-6 items-center justify-center">
            <Image src="/images/bookmark.svg" alt="" width={14} height={18} />
          </button>
        </div>
      )}
    </div>
  );
}
