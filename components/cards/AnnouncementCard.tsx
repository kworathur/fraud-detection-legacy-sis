import type { Announcement } from '@/lib/types';

export default function AnnouncementCard({
    announcement,
}: Readonly<{
    announcement: Announcement;
}>) {
    return (
        <div className="flex h-33.75 w-78.75 flex-col overflow-hidden rounded-sm bg-white">
            <div className="h-3.25 shrink-0 rounded-t-sm bg-gt-gold" />
            <div className="flex flex-1 items-center justify-center px-2 py-3 text-center font-[Arial,sans-serif] text-[0.9375rem] leading-5.25 text-black">
                <p>{announcement.title}</p>
            </div>
            <div className="flex items-center justify-between px-3 pb-2">
                <span className="font-[Arial,sans-serif] text-[0.875rem] leading-normal text-nav-muted">
                    {announcement.index}
                </span>
                <a
                    href={announcement.linkHref}
                    className="font-[Arial,sans-serif] text-[0.8125rem] leading-normal text-link-blue underline"
                >
                    {announcement.linkText}
                </a>
            </div>
        </div>
    );
}
