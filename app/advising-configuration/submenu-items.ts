export const ADVISING_CONFIGURATION_SUBMENU = [
  {
    label: "Assign Advisors to Students",
    href: "/advising-configuration",
    match: ["/advising-configuration", "/advising-configuration/new-rule"],
  },
  {
    label: "Customize Advising Insights",
    href: "/advising-configuration/insights",
    match: [
      "/advising-configuration/insights",
      "/advising-configuration/insights/new",
    ],
  },
  {
    label: "Advising Insight Playground",
    href: "/advising-configuration/playground",
    match: ["/advising-configuration/playground"],
  },
] as const;
