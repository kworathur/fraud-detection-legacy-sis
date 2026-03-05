import BaseCard from "./BaseCard";
import CardHeader from "./CardHeader";
import CardFooter from "./CardFooter";
import Alert from "@/components/ui/Alert";
import type { AdvisingCardProps } from "@/lib/types";

function ChatBubble({
  sender,
  text,
}: Readonly<{ sender: string; text: string }>) {
  return (
    <div className="relative ml-[2rem] flex flex-col items-start rounded-[0.75rem] bg-[#f8fafc] shadow-[0_0.0625rem_0.0625rem_rgba(0,0,0,0.1)]">
      <div className="absolute bottom-0 left-[-0.375rem] h-[0.9375rem] w-[0.75rem]">
        <svg
          width="12"
          height="15"
          viewBox="0 0 12 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 15C5.5 15 1 11.5 0 5V15H11Z" fill="#f8fafc" />
        </svg>
      </div>
      <div className="flex w-full items-start px-[0.625rem] pt-[0.25rem]">
        <p className="font-[family-name:var(--font-akshar),sans-serif] text-[0.9375rem] font-semibold leading-[1.25rem] text-[#075985]">
          {sender}
        </p>
      </div>
      <div className="flex w-full items-center justify-center pb-[0.4375rem] pl-[0.625rem] pr-[1.25rem] pt-[0.375rem]">
        <p className="flex-1 font-[family-name:Inter,sans-serif] text-[1rem] leading-[1.375rem] text-[#2d3748]">
          {text}
        </p>
      </div>
    </div>
  );
}

function AdvisorAvatar() {
  return (
    <div className="absolute bottom-0 left-0 h-[2.5rem] w-[1.5rem] overflow-hidden rounded-full bg-[#e0f2fe]">
      <svg
        className="absolute bottom-[0.25rem] left-[0.1875rem]"
        width="18"
        height="20"
        viewBox="0 0 18 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="9" cy="6" r="4" fill="#94a3b8" />
        <ellipse cx="9" cy="18" rx="8" ry="6" fill="#94a3b8" />
      </svg>
    </div>
  );
}

function CheckboxItem({ text }: Readonly<{ text: string }>) {
  return (
    <div className="flex w-full shrink-0 items-center gap-[0.375rem]">
      <div className="flex h-[1.6875rem] w-[2.0625rem] shrink-0 flex-col items-center justify-center p-[0.25rem]">
        <div className="flex items-center justify-center rounded-full p-[0.6875rem]">
          <div className="h-[1.125rem] w-[1.125rem] rounded-[0.125rem] border border-[#3b82f6]" />
        </div>
      </div>
      <p className="w-[15.75rem] font-[family-name:Arial,sans-serif] text-[0.8125rem] leading-[1rem] text-slate-900">
        {text}
      </p>
    </div>
  );
}

export default function AdvisingCard({
  title,
  advisorName,
  slotsLeft,
  chatMessage,
  actionItem,
  ctaText,
}: Readonly<AdvisingCardProps>) {
  return (
    <BaseCard
      header={<CardHeader title={title} />}
      contentClassName="gap-[0.3125rem]"
    >
      <Alert
        variant="info"
        text={`${slotsLeft} Advising Slots Left This Week!`}
      />
      <div className="flex flex-1 flex-col items-center justify-center px-[0.875rem] py-[0.375rem]">
        <div className="relative w-full">
          <p className="mb-[0.25rem] font-[family-name:Arial,sans-serif] text-[0.875rem] font-bold leading-normal text-[#2d3748]">
            Your Advisor, {advisorName}{" "}
            <span className="text-[0.75rem]">✨</span>
          </p>
          <div className="relative h-[3.75rem]">
            <AdvisorAvatar />
            <ChatBubble sender={chatMessage.sender} text={chatMessage.text} />
          </div>
        </div>
        <CheckboxItem text={actionItem} />
      </div>
      <CardFooter ctaText={ctaText} ctaHref="/advising-meetings/new" />
    </BaseCard>
  );
}
