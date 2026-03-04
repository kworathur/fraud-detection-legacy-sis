import AnnouncementCard from "./AnnouncementCard";
import type { Announcement } from "@/lib/types";

export default function AnnouncementCards({
  announcements,
}: Readonly<{
  announcements: Announcement[];
}>) {
  return (
    <div>
      <AnnouncementCard announcement={announcements[0]} />
    </div>
  );
}
