import type { Announcement } from "@/lib/types";

export default function AnnouncementCard({
  announcement,
}: Readonly<{
  announcement: Announcement;
}>) {
  return (
    <div className="relative h-[8.4375rem] w-[19.875rem] shrink-0 overflow-hidden rounded-[0.25rem] bg-white">
      <div className="absolute inset-x-0 top-0 h-[0.8125rem] rounded-t-[0.25rem] bg-gt-gold" />
      <div className="absolute inset-[33.78%_1.57%_39.86%_1.57%] flex items-center justify-center text-center font-[family-name:Arial,sans-serif] text-[0.9375rem] leading-[1.3125rem] text-black">
        <p>{announcement.title}</p>
      </div>
      <div className="absolute bottom-[8.78%] left-[4.4%] font-[family-name:Arial,sans-serif] text-[0.875rem] leading-normal text-[#718096]">
        {announcement.index}
      </div>
      <a
        href={announcement.linkHref}
        className="absolute bottom-[8.78%] right-[4.4%] font-[family-name:Arial,sans-serif] text-[0.8125rem] leading-normal text-[#3182ce] underline"
      >
        {announcement.linkText}
      </a>
    </div>
  );
}
