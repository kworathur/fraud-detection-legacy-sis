import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex h-[53px] items-center justify-between py-[13px]">
      <div className="flex items-center gap-[19px]">
        <button type="button" className="text-white hover:text-white/80">
          <Image
            src="/images/menu-icon.svg"
            alt="Menu"
            width={17}
            height={14}
          />
        </button>
        <div className="flex w-[237px] items-center justify-center">
          <Image
            src="/images/gt-logo.svg"
            alt="Georgia Tech"
            width={60}
            height={37}
          />
          <span className="font-[family-name:var(--font-georgia)] text-[40px] leading-normal text-white">
            {" | Hive"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-[30px]">
        <button type="button" className="relative">
          <Image
            src="/images/calendar-icon.svg"
            alt="Calendar"
            width={20}
            height={22}
          />
          <Image
            src="/images/calendar-check.svg"
            alt=""
            width={10}
            height={7}
            className="absolute left-[5px] top-[10px]"
          />
        </button>
        <button type="button">
          <Image
            src="/images/bell-icon.svg"
            alt="Notifications"
            width={19}
            height={25}
          />
        </button>
        <button type="button">
          <Image
            src="/images/grid-icon.svg"
            alt="Apps"
            width={21}
            height={20}
          />
        </button>
        <div className="relative">
          <Image
            src="/images/avatar.svg"
            alt="User avatar"
            width={37}
            height={38}
          />
          <span className="absolute inset-0 flex items-center justify-center font-[family-name:Arial,sans-serif] text-[18px] font-bold text-[#4a5568]">
            J
          </span>
        </div>
      </div>
    </nav>
  );
}
