import Image from "next/image";

export default function TableFilter({
  label,
  active = false,
  onRemove,
}: Readonly<{
  label: string;
  active?: boolean;
  onRemove?: () => void;
}>) {
  return (
    <div
      className={`inline-flex h-[1.375rem] items-center justify-center gap-0 rounded-[0.75rem] border px-[0.4375rem] py-[0.25rem] ${
        active
          ? "border-[#0ea5e9] bg-[#e0f2fe]"
          : "border-[#d4d4d4] bg-white"
      }`}
    >
      <span
        className={`font-[family-name:Arial,sans-serif] text-[0.625rem] ${
          active ? "text-[#0369a1]" : "text-[#4b5563]"
        }`}
      >
        {label}
      </span>
      {active && onRemove && (
        <button type="button" onClick={onRemove} className="shrink-0">
          <Image
            src="/images/close-icon.svg"
            alt="Remove filter"
            width={24}
            height={24}
          />
        </button>
      )}
    </div>
  );
}
