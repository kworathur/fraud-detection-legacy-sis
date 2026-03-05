import Image from "next/image";

export default function CardHeader({
  title,
  actions,
}: Readonly<{
  title: string;
  actions?: React.ReactNode;
}>) {
  return (
    <div className="flex shrink-0 items-center gap-10.25 px-3.5">
      <p className="w-49 font-sans text-[0.9375rem] font-semibold tracking-[0.0375rem] text-title-dark">
        {title}
      </p>
      {actions ?? (
        <div className="flex items-center gap-1.75">
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center"
          >
            <Image src="/images/more-vert.svg" alt="" width={3} height={11} />
          </button>
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center"
          >
            <Image src="/images/bookmark.svg" alt="" width={14} height={18} />
          </button>
        </div>
      )}
    </div>
  );
}
