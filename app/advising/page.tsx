import Image from "next/image";

function SmallNav() {
  return (
    <nav className="flex h-[38px] items-center justify-between bg-[#b3a369] px-[17px] py-[16px]">
      <div className="flex items-center gap-[27px]">
        <Image src="/images/menu-icon.svg" alt="Menu" width={17} height={14} />
        <span
          style={{ fontFamily: "Arial, sans-serif", fontSize: "16px", color: "white" }}
        >
          Home
        </span>
      </div>
      <div className="flex items-center gap-[30px]">
        <button type="button" className="relative">
          <Image src="/images/calendar-icon.svg" alt="Calendar" width={20} height={22} />
          <Image
            src="/images/calendar-check.svg"
            alt=""
            width={10}
            height={7}
            className="absolute left-[5px] top-[10px]"
          />
        </button>
        <button type="button">
          <Image src="/images/bell-icon.svg" alt="Notifications" width={19} height={25} />
        </button>
        <button type="button">
          <Image src="/images/grid-icon.svg" alt="Apps" width={21} height={20} />
        </button>
        <div className="relative">
          <Image src="/images/avatar.svg" alt="User avatar" width={37} height={38} />
          <span className="absolute inset-0 flex items-center justify-center font-[family-name:Arial,sans-serif] text-[18px] font-bold text-[#4a5568]">
            J
          </span>
        </div>
      </div>
    </nav>
  );
}

function FormPageHeader() {
  return (
    <div className="flex h-[44px] items-end border-b border-[#d1d5db] bg-white pb-[10px] pl-[15px] pr-[10px] pt-px">
      <span
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          fontWeight: "bold",
          color: "black",
        }}
      >
        Advising Meeting Scheduling Form
      </span>
    </div>
  );
}

function EditIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        fill="white"
      />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
        stroke="#9ca3af"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="8"
        y="2"
        width="8"
        height="4"
        rx="1"
        ry="1"
        stroke="#9ca3af"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Sidebar() {
  return (
    <aside className="flex w-[216px] shrink-0 flex-col gap-[16px] border-r border-[#d1d5db] bg-white px-[22px] py-[18px]">
      {/* Step 1 — Active */}
      <div className="flex items-center gap-[6px]">
        <div
          className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#4ec8ff]"
          style={{ boxShadow: "inset 0 0 0 2px white" }}
        >
          <EditIcon />
        </div>
        <span
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            fontWeight: "bold",
            color: "black",
            width: "147px",
          }}
        >
          Advising Meeting Scheduling Form
        </span>
      </div>

      {/* Step 2 — Inactive */}
      <div className="flex items-center gap-[6px]">
        <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#e5e7eb]">
          <ClipboardIcon />
        </div>
        <span
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            fontWeight: "bold",
            color: "black",
            width: "147px",
          }}
        >
          Review and Submit
        </span>
      </div>
    </aside>
  );
}

function DisabledField({ label }: Readonly<{ label: string }>) {
  return (
    <div className="flex h-[46px] w-[225px] flex-col items-start gap-[8px]">
      <label
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
          height: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          lineHeight: "normal",
        }}
      >
        {label}
      </label>
      <input
        type="text"
        readOnly
        className="h-[28px] w-full bg-[#f3f4f6]"
        style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", border: "none" }}
      />
    </div>
  );
}

function DropdownField({ label, placeholder }: Readonly<{ label: string; placeholder: string }>) {
  return (
    <div className="relative h-[49px] w-[225px]">
      <label
        className="absolute"
        style={{
          top: "5px",
          transform: "translateY(-50%)",
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
          lineHeight: "normal",
        }}
      >
        {label}
      </label>
      <button
        type="button"
        className="absolute left-0 flex w-[225px] items-center justify-start gap-[10px] border border-[#d1d5db] bg-white p-[6px]"
        style={{ top: "21px", height: "28px" }}
      >
        <Image src="/images/chevron-down.svg" alt="" width={16} height={16} />
        <span style={{ fontFamily: "Arial, sans-serif", fontSize: "12px" }}>
          {placeholder}
        </span>
      </button>
    </div>
  );
}

function TextField({ label, placeholder }: Readonly<{ label: string; placeholder: string }>) {
  return (
    <div className="relative h-[49px] w-[225px]">
      <label
        className="absolute"
        style={{
          top: "5px",
          transform: "translateY(-50%)",
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
          lineHeight: "normal",
        }}
      >
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        className="absolute left-0 flex w-[225px] items-center border border-[#d1d5db] bg-white px-[10px] py-[6px]"
        style={{
          top: "21px",
          height: "28px",
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
        }}
      />
    </div>
  );
}

function AdvisingForm() {
  return (
    <div className="flex w-[686px] flex-col gap-[13px]">
      {/* Form Header Block */}
      <div className="flex flex-col">
        {/* GT Gold bar */}
        <div className="h-[74px] w-full bg-[#b3a369]" />
        {/* Title banner */}
        <div className="flex h-[29px] items-center justify-center bg-[#4ec8ff] px-[10px]">
          <span
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "22px",
              color: "black",
              textAlign: "center",
            }}
          >
            Advising Meeting Scheduling Form
          </span>
        </div>
        {/* Description area */}
        <div className="flex h-[145px] items-center py-[10px]">
          <p style={{ fontFamily: "Arial, sans-serif", fontSize: "20px", color: "black" }}>
            Use this form to schedule a virtual zoom meeting with your advisor. Select the topic
            you wish to discuss during your meeting, so that we can match you with another advisor
            if your assigned advisor is unavailable.
          </p>
        </div>
      </div>

      {/* Form Fields Block */}
      <div className="flex w-full flex-col gap-[16px]">
        <DisabledField label="* Your Student ID" />
        <DisabledField label="* Your Name" />
        <DisabledField label="* Email Address" />
        <DropdownField label="* Date" placeholder="-- Select Date --" />
        <DropdownField label="* Meeting Time" placeholder="-- Select Time --" />
        <TextField label="* What Would You Like to Discuss?" placeholder="Enter Additional Details Here" />
      </div>
    </div>
  );
}

export default function AdvisingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <SmallNav />
      <FormPageHeader />
      <div className="flex flex-1 items-stretch">
        <Sidebar />
        <div className="flex flex-1 items-start justify-center px-[54px] py-[10px]">
          <AdvisingForm />
        </div>
      </div>
    </div>
  );
}
