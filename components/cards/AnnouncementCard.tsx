import type { Announcement } from "@/lib/types";

export default function AnnouncementCard({
  announcement,
}: Readonly<{
  announcement: Announcement;
}>) {
  return (
    <div className="relative h-[148px] w-[318px] shrink-0 overflow-hidden rounded bg-white">
      <div className="absolute inset-x-0 top-0 h-[14px] rounded-t bg-gt-gold" />
      <div className="absolute inset-[33.78%_1.57%_39.86%_1.57%] flex items-center justify-center text-center font-[family-name:Arial,sans-serif] text-[15px] leading-[21px] text-black">
        <p>{announcement.title}</p>
      </div>
      <div className="absolute bottom-[8.78%] left-[4.4%] font-[family-name:Arial,sans-serif] text-[14px] leading-normal text-[#718096]">
        {announcement.index}
      </div>
      <a
        href={announcement.linkHref}
        className="absolute bottom-[8.78%] right-[4.4%] font-[family-name:Arial,sans-serif] text-[13px] leading-normal text-[#3182ce] underline"
      >
        {announcement.linkText}
      </a>
    </div>
  );
}
