export interface Announcement {
  id: string;
  title: string;
  linkText: string;
  linkHref: string;
  index: string;
}

export interface DisbursementCardProps {
  variant: "alert" | "info";
  title: string;
  bannerText: string;
  ctaText: string;
}

export interface Course {
  code: string;
  title: string;
  modality: string;
  dateRange: string;
}

export interface ClassesCardProps {
  title: string;
  term: string;
  courses: Course[];
}

export interface GenericCardProps {
  title: string;
  subHeader?: string;
  bodyHeading?: string;
  bodyText?: string;
  ctaText?: string;
}

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}
