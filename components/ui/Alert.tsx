import Image from "next/image";

const variants = {
  warning: {
    bg: "bg-alert-red-bg",
    bar: "bg-alert-red",
    text: "text-alert-red",
    icon: "warning",
  },
  success: {
    bg: "bg-success-green-bg",
    bar: "bg-success-green",
    text: "text-success-green",
    icon: "success",
  },
  info: {
    bg: "bg-info-blue-bg",
    bar: "bg-[#075985]",
    text: "text-[#075985]",
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
      <div className="flex h-10.75 w-full items-center justify-center gap-2 p-1">
        {variant === "warning" && (
          <div className="relative h-5 w-5 shrink-0">
            <Image
              src="/images/warning-icon.svg"
              alt=""
              width={20}
              height={20}
            />
            <span className="absolute inset-0 flex items-center justify-center font-[Arial,sans-serif] text-[1rem] font-bold text-white">
              !
            </span>
          </div>
        )}
        {variant === "success" && (
          <div className="relative h-5 w-5 shrink-0">
            <Image
              src="/images/check-circle.svg"
              alt=""
              width={20}
              height={20}
            />
          </div>
        )}
        {variant === "info" && (
          <div className="relative h-5 w-5 shrink-0">
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
