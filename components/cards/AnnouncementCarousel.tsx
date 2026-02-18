import AnnouncementCard from "./AnnouncementCard";
import type { Announcement } from "@/lib/types";

export default function AnnouncementCards({
  announcements,
}: Readonly<{
  announcements: Announcement[];
}>) {
  return (
    <div className="flex gap-[21px]">
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </div>
  );
}
