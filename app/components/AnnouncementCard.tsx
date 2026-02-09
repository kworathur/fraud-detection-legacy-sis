export default function AnnouncementCard({
  title,
  currentIndex,
  totalCount,
  linkText,
  linkHref,
}: Readonly<{
  title: string;
  currentIndex: number;
  totalCount: number;
  linkText: string;
  linkHref: string;
}>) {
  return (
    <div className="w-[318px] rounded-t-[4px] border border-[#e2e8f0] bg-white">
      <div className="h-[14px] rounded-t-[4px] bg-[#b3a369]" />
      <div className="px-[5px] pt-[12px] pb-[13px]">
        <p className="text-center text-[15px] leading-[21px] text-black">
          {title}
        </p>
      </div>
      <div className="flex items-center justify-between px-[14px] pb-[13px]">
        <span className="text-[14px] text-[#718096]">
          {currentIndex} of {totalCount}
        </span>
        <a
          href={linkHref}
          className="text-[13px] text-[#3182ce] underline"
        >
          {linkText}
        </a>
      </div>
    </div>
  );
}
