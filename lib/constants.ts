import type {
    Announcement,
    AdvisingCardProps,
    DisbursementCardProps,
    ClassesCardProps,
    GenericCardProps,
    NavLink,
} from './types';

export const announcements: Announcement[] = [
    {
        id: '1',
        title: 'From Code to Campus: How One Internship is Shaping the Future of Student Tech',
        linkText: 'Internship Opportunities',
        linkHref: '#',
        index: '1 of 1',
    },
];

export const disbursementAlert: DisbursementCardProps = {
    variant: 'alert',
    title: 'Aid Disbursement Status',
    bannerText: 'Spring 2026: Disbursement on Hold',
    ctaText: 'UPLOAD DOCUMENTS',
};

export const disbursementInfo: DisbursementCardProps = {
    variant: 'info',
    title: 'Aid Disbursement Status',
    bannerText: 'Spring 2026: Disbursement Scheduled',
    ctaText: 'MANAGE BANK ACCOUNT',
};

export const classesData: ClassesCardProps = {
    title: 'Classes',
    term: 'Spring 2026',
    courses: [
        {
            code: 'ART 100',
            title: 'Art Appreciation - Exploring Together (Online)',
            modality: 'Online',
            dateRange: 'Jan 1, 2026 - May 30, 2026',
        },
    ],
};

export const genericCardData: GenericCardProps = {
    title: 'Card Header',
    subHeader: 'Card Sub-header',
    bodyHeading: 'Card Body:',
    bodyText: 'Card Content',
    ctaText: 'CTA',
};

export const advisingCardData: AdvisingCardProps = {
    title: 'Advising Appointments',
    advisorName: 'Advisor',
    slotsLeft: 8,
    chatMessage: {
        sender: 'Your Advisor',
        text: "Consider adding a sysarch thread - you're only 1.5 credits away!",
        time: '12.00',
    },
    actionItem: 'Book a meeting with your advisor to discuss threads',
    ctaText: 'BOOK MEETING',
};

export const navLinks: NavLink[] = [
    { label: 'Home', href: '/experience' },
    { label: 'Academic Services', href: '/academic-services' },
    { label: 'Community', href: '/community' },
    { label: 'Student Financials', href: '/student-financials' },
    { label: 'Work', href: '/work' },
];
