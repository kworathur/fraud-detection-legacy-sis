import Image from "next/image";
import type { NavLink } from "@/lib/types";

export default function NavLinks({
  links,
}: Readonly<{
  links: NavLink[];
}>) {
  return (
    <div className="relative h-[38px] w-full bg-white">
      <div className="absolute inset-x-[4.48%] bottom-0 top-[29.27%] flex items-center justify-between">
        <nav className="flex gap-6">
          {links.map((link) => (
            <div key={link.label} className="relative">
              <a
                href={link.href}
                className={
                  link.active
                    ? "font-[family-name:Arial,sans-serif] text-[15px] font-bold text-[#3182ce]"
                    : "font-[family-name:Arial,sans-serif] text-[14px] text-[#718096]"
                }
              >
                {link.label}
              </a>
              {link.active && (
                <div className="absolute -bottom-[2px] left-0 right-0 h-[2.5px] bg-[#3182ce]" />
              )}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button type="button">
            <Image src="/images/search-icon.svg" alt="Search" width={14} height={13} />
          </button>
          <span className="font-[family-name:Arial,sans-serif] text-[12px] font-bold tracking-[0.48px] text-[#3182ce]">
            VIEW ALL CARDS
          </span>
        </div>
      </div>
    </div>
  );
}
