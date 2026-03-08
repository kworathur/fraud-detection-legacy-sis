'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavLink } from '@/lib/types';

export default function NavLinks({
    links,
}: Readonly<{
    links: NavLink[];
}>) {
    const pathname = usePathname();

    return (
        <div className="flex h-9.75 w-full items-end justify-between border-b border-nav-border bg-white px-[clamp(1.5rem,5vw,5rem)] overflow-auto">
            <nav className="flex items-end gap-6">
                {links.map((link) => {
                    const isActive = pathname === link.href;

                    return (
                        <div key={link.label} className="relative pb-1.5">
                            <Link
                                href={link.href}
                                className={
                                    isActive
                                        ? 'font-[family-name:Arial,sans-serif] text-[0.9375rem] font-bold text-link-blue text-nowrap'
                                        : 'font-[family-name:Arial,sans-serif] text-[0.875rem] text-nav-muted text-nowrap'
                                }
                            >
                                {link.label}
                            </Link>
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-link-blue" />
                            )}
                        </div>
                    );
                })}
            </nav>
            <div className="flex items-center gap-1.25 pb-1.5">
                <button type="button">
                    <Image
                        src="/images/search-icon.svg"
                        alt="Search"
                        width={16}
                        height={16}
                    />
                </button>
                <span className="font-akshar text-[0.875rem] font-bold tracking-[0.035rem] text-link-blue text-nowrap">
                    VIEW ALL CARDS
                </span>
            </div>
        </div>
    );
}
