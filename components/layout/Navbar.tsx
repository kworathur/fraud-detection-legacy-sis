import Image from "next/image";

function NavQuickActions() {
  return (
    <div className="flex items-center gap-[1.875rem]">
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
          className="absolute left-[0.3125rem] top-[0.625rem]"
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
        <span className="absolute inset-0 flex items-center justify-center font-[family-name:Arial,sans-serif] text-[1.125rem] font-bold text-[#4a5568]">
          J
        </span>
      </div>
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="flex h-[3.3125rem] items-center justify-between py-[0.8125rem]">
      <div className="flex items-center gap-[1.1875rem]">
        <button type="button" className="text-white hover:text-white/80">
          <Image
            src="/images/menu-icon.svg"
            alt="Menu"
            width={17}
            height={14}
          />
        </button>
        <div className="flex items-center gap-[1.3125rem]">
          <Image
            src="/images/gt-logo.svg"
            alt="Georgia Tech"
            width={60}
            height={37}
          />
          <div className="h-[2.8125rem] w-0 border-l border-white/40" />
          <span className="font-[family-name:'Roboto_Slab',serif] text-[2.5rem] leading-normal text-white">
            BuzzPort
          </span>
        </div>
      </div>
      <NavQuickActions />
    </nav>
  );
}

export function SmallNav() {
  return (
    <nav className="flex h-[2.8125rem] items-center justify-between bg-gt-gold px-[1.0625rem] py-[1rem]">
      <div className="flex items-center gap-[1.6875rem]">
        <button type="button" className="text-white hover:text-white/80">
          <Image
            src="/images/menu-icon.svg"
            alt="Menu"
            width={17}
            height={14}
          />
        </button>
        <span className="font-[family-name:Arial,sans-serif] text-[1rem] leading-normal text-white">
          Home
        </span>
      </div>
      <NavQuickActions />
    </nav>
  );
}
