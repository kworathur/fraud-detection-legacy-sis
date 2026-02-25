import Image from "next/image";

const variants = {
  warning: {
    bg: "bg-[#fff2f0]",
    bar: "bg-[#b91c1c]",
    text: "text-[#b91c1c]",
    icon: "warning",
  },
  success: {
    bg: "bg-[#dcfce7]",
    bar: "bg-[#14532d]",
    text: "text-[#14532d]",
    icon: "success",
  },
  info: {
    bg: "bg-[#e0f2fe]",
    bar: "bg-[#0369a1]",
    text: "text-[#0369a1]",
    icon: "info",
  },
} as const;

export default function Alert({
  variant,
  text,
  className = "",
}: Readonly<{
  variant: "warning" | "success" | "info";
  text: string;
  className?: string;
}>) {
  const v = variants[variant];

  return (
    <div className={`flex w-full flex-col items-start ${v.bg} ${className}`}>
      <div className={`h-[0.3125rem] w-full ${v.bar}`} />
      <div className="flex h-[2.6875rem] w-full items-center justify-center gap-[0.5rem] p-[0.25rem]">
        {variant === "warning" && (
          <div className="relative h-[1.25rem] w-[1.25rem] shrink-0">
            <Image
              src="/images/warning-icon.svg"
              alt=""
              width={20}
              height={20}
            />
            <span className="absolute inset-0 flex items-center justify-center font-[family-name:Arial,sans-serif] text-[1rem] font-bold text-white">
              !
            </span>
          </div>
        )}
        {variant === "success" && (
          <div className="relative h-[1.25rem] w-[1.25rem] shrink-0">
            <Image
              src="/images/check-circle.svg"
              alt=""
              width={20}
              height={20}
            />
          </div>
        )}
        {variant === "info" && (
          <div className="relative h-[1.25rem] w-[1.25rem] shrink-0">
            <Image
              src="/images/info-circle.svg"
              alt=""
              width={20}
              height={20}
            />
          </div>
        )}
        <p
          className={`font-[family-name:Arial,sans-serif] text-[0.9375rem] font-bold leading-normal ${v.text}`}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
