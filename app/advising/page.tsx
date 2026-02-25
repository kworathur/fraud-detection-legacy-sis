import { SmallNav } from "@/components/layout/Navbar";
import FormHeader from "@/components/ui/FormHeader";
import FormSteps from "@/components/ui/FormSteps";
import type { FormStep } from "@/components/ui/FormSteps";

const steps: FormStep[] = [
  { label: "Advising Meeting Scheduling Form", icon: "edit", active: true },
  { label: "Review and Submit", icon: "clipboard" },
];

function DisabledField({ label }: Readonly<{ label: string }>) {
  return (
    <div className="flex w-[14.0625rem] flex-col items-start gap-[0.5rem]">
      <label className="font-[family-name:Arial,sans-serif] text-[0.75rem] leading-none text-black">
        {label}
      </label>
      <div className="h-[1.75rem] w-full bg-[#f3f4f6]" />
    </div>
  );
}

function DropdownField({
  label,
  placeholder,
}: Readonly<{ label: string; placeholder: string }>) {
  return (
    <div className="flex w-[14.0625rem] flex-col gap-[0.5rem]">
      <label className="font-[family-name:Arial,sans-serif] text-[0.75rem] leading-none text-black">
        {label}
      </label>
      <div className="flex h-[1.75rem] w-full items-center gap-[0.625rem] border border-[#d1d5db] bg-white p-[0.375rem]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="#6b7280"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-[family-name:Arial,sans-serif] text-[0.75rem] text-black">
          {placeholder}
        </span>
      </div>
    </div>
  );
}

function TextField({
  label,
  placeholder,
}: Readonly<{ label: string; placeholder: string }>) {
  return (
    <div className="flex w-[14.0625rem] flex-col gap-[0.5rem]">
      <label className="font-[family-name:Arial,sans-serif] text-[0.75rem] leading-none text-black">
        {label}
      </label>
      <div className="flex h-[1.75rem] w-full items-center border border-[#d1d5db] bg-white px-[0.625rem] py-[0.375rem]">
        <span className="font-[family-name:Arial,sans-serif] text-[0.75rem] text-black">
          {placeholder}
        </span>
      </div>
    </div>
  );
}

function AdvisingForm() {
  return (
    <div className="flex w-[42.875rem] flex-col gap-[0.8125rem]">
      {/* Form Header Block */}
      <div className="flex flex-col">
        <div className="h-[4.625rem] w-full bg-gt-gold" />
        <div className="flex h-[2.4375rem] items-center justify-center bg-[#4ec8ff] p-[0.625rem]">
          <span className="font-[family-name:Arial,sans-serif] text-[1.5rem] text-black">
            Advising Meeting Scheduling Form
          </span>
        </div>
        <div className="flex items-center py-[0.625rem]">
          <p className="font-[family-name:Arial,sans-serif] text-[1.25rem] leading-normal text-black">
            Use this form to schedule a virtual zoom meeting with your advisor.
            Select the topic you wish to discuss during your meeting, so that we
            can match you with another advisor if your assigned advisor is
            unavailable.
          </p>
        </div>
      </div>

      {/* Form Fields Block */}
      <div className="flex w-full flex-col gap-[1rem]">
        <DisabledField label="* Your Student ID" />
        <DisabledField label="* Your Name" />
        <DisabledField label="*Email Address" />
        <DropdownField label="* Date" placeholder="-- Select Date --" />
        <DropdownField
          label="* Meeting Time"
          placeholder="-- Select Date --"
        />
        <TextField
          label="* What Would You Like to Discuss?"
          placeholder="Enter Additional Details Here"
        />
      </div>
    </div>
  );
}

export default function AdvisingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <SmallNav />
      <FormHeader title="Advising Meeting Scheduling Form" />
      <div className="flex flex-1 items-stretch">
        <FormSteps steps={steps} />
        <div className="flex flex-1 items-start justify-center px-[3.375rem] py-[0.625rem]">
          <AdvisingForm />
        </div>
      </div>
    </div>
  );
}
