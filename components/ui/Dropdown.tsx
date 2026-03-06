import Image from "next/image";

export type DropdownOption = {
  value: string;
  label: string;
};

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = "-- Select --",
  disabled = false,
  className,
}: Readonly<{
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}>) {
  return (
    <div className="relative flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`h-7 w-full appearance-none border border-[#d1d5db] bg-white pr-7 pl-2.5 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce] disabled:bg-[#f3f4f6] disabled:text-[#404040] ${className ?? ""}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-600">
        <Image src="/images/chevron-down.svg" alt="" width={10} height={6} />
      </div>
    </div>
  );
}
