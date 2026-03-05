import Image from "next/image";

export function FormFieldText({
  label,
  required = false,
  placeholder,
  value,
  onChange,
}: Readonly<{
  label: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}>) {
  return (
    <div className="flex w-56.25 flex-col gap-2">
      <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
        {required && "* "}
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-7 w-full border border-[#d1d5db] bg-white px-2.5 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
      />
    </div>
  );
}

export function FormFieldDisabled({
  label,
  required = false,
  value,
}: Readonly<{
  label: string;
  required?: boolean;
  value?: string;
}>) {
  return (
    <div className="flex w-56.25 flex-col gap-2">
      <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
        {required && "* "}
        {label}
      </label>
      <div className="flex h-7 w-full items-center bg-[#f3f4f6] px-2.5 font-[Arial,sans-serif] text-[0.75rem] text-black">
        {value}
      </div>
    </div>
  );
}

export function FormFieldDropdown({
  label,
  required = false,
  placeholder = "-- Select --",
  options,
  value,
  onChange,
}: Readonly<{
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
}>) {
  return (
    <div className="flex w-56.25 flex-col gap-2">
      <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
        {required && "* "}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="h-7 w-full appearance-none border border-[#d1d5db] bg-white px-1.5 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
        >
          <option value="">{placeholder}</option>
          {options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2">
          <Image
            src="/images/chevron-down.svg"
            alt=""
            width={16}
            height={16}
          />
        </div>
      </div>
    </div>
  );
}
