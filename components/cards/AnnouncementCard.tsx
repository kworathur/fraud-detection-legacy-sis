import type { Announcement } from "@/lib/types";

export default function AnnouncementCard({
  announcement,
}: Readonly<{
  announcement: Announcement;
}>) {
  return (
    <div className="flex h-[8.4375rem] w-78.75 flex-col overflow-hidden rounded-[0.25rem] bg-white">
      <div className="h-[0.8125rem] shrink-0 rounded-t-[0.25rem] bg-gt-gold" />
      <div className="flex flex-1 items-center justify-center px-2 py-3 text-center font-[family-name:Arial,sans-serif] text-[0.9375rem] leading-[1.3125rem] text-black">
        <p>{announcement.title}</p>
      </div>
      <div className="flex items-center justify-between px-3 pb-2">
        <span className="font-[family-name:Arial,sans-serif] text-[0.875rem] leading-normal text-nav-muted">
          {announcement.index}
        </span>
        <a
          href={announcement.linkHref}
          className="font-[family-name:Arial,sans-serif] text-[0.8125rem] leading-normal text-link-blue underline"
        >
          {announcement.linkText}
        </a>
      </div>
    </div>
  );
}
