import Image from "next/image";

export interface FormStep {
  label: string;
  icon: "edit" | "clipboard";
  active?: boolean;
}

function StepIcon({
  icon,
  active,
}: Readonly<{ icon: "edit" | "clipboard"; active: boolean }>) {
  return (
    <div
      className={`relative h-[1.625rem] w-[1.625rem] shrink-0 rounded-full ${
        active ? "bg-[#0369a1]" : "bg-[#e5e7eb]"
      }`}
    >
      <div
        className={`absolute left-[0.0625rem] top-[0.0625rem] flex h-[1.5rem] w-[1.5rem] items-center justify-center rounded-full border border-white bg-transparent`}
      >
        <Image
          src={
            icon === "edit"
              ? "/images/edit-icon.svg"
              : "/images/clipboard-icon.svg"
          }
          alt=""
          width={icon === "edit" ? 18 : 16}
          height={icon === "edit" ? 18 : 16}
          className={icon === "edit" ? "" : ""}
        />
      </div>
    </div>
  );
}

export default function FormSteps({
  steps,
}: Readonly<{
  steps: FormStep[];
}>) {
  return (
    <div className="flex w-[13.5rem] shrink-0 flex-col gap-[1rem] border-r border-[#d1d5db] bg-white px-[1.375rem] py-[1.125rem]">
      {steps.map((step) => (
        <div key={step.label} className="flex w-full items-center gap-[0.375rem]">
          <StepIcon icon={step.icon} active={step.active ?? false} />
          <p className="font-[family-name:Arial,sans-serif] text-[0.875rem] font-bold leading-none text-black">
            {step.label}
          </p>
        </div>
      ))}
    </div>
  );
}
