export const ADVISING_HOME_SUBMENU = [
  {
    label: "Your Assigned Students",
    href: "/advising-home",
    match: ["/advising-home"],
  },
  {
    label: "Indicate Availability",
    href: "/advising-home/availability",
    match: ["/advising-home/availability"],
  },
  {
    label: "Upcoming Meetings",
    href: "/advising-home/meetings",
    match: ["/advising-home/meetings"],
  },
] as const;
