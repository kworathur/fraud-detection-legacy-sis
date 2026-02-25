import Image from "next/image";
import type { NavLink } from "@/lib/types";

export default function NavLinks({
  links,
}: Readonly<{
  links: NavLink[];
}>) {
  return (
    <div className="flex h-[2.4375rem] w-full items-end justify-between border-b border-[#d1d5db] bg-white px-[2.625rem]">
      <nav className="flex items-end gap-[1.5rem]">
        {links.map((link) => (
          <div key={link.label} className="relative pb-[0.375rem]">
            <a
              href={link.href}
              className={
                link.active
                  ? "font-[family-name:Arial,sans-serif] text-[0.9375rem] font-bold text-[#3182ce]"
                  : "font-[family-name:Arial,sans-serif] text-[0.875rem] text-[#718096]"
              }
            >
              {link.label}
            </a>
            {link.active && (
              <div className="absolute bottom-0 left-0 right-0 h-[0.1875rem] bg-[#3182ce]" />
            )}
          </div>
        ))}
      </nav>
      <div className="flex items-center gap-[0.3125rem] pb-[0.375rem]">
        <button type="button">
          <Image
            src="/images/search-icon.svg"
            alt="Search"
            width={24}
            height={24}
          />
        </button>
        <span className="font-[family-name:var(--font-akshar)] text-[0.875rem] font-bold tracking-[0.035rem] text-[#3182ce]">
          VIEW ALL CARDS
        </span>
      </div>
    </div>
  );
}
