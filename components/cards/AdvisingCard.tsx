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
    <div className="relative ml-8 flex flex-col items-start rounded-xl bg-[#f8fafc] shadow-[0_0.0625rem_0.0625rem_rgba(0,0,0,0.1)]">
      <div className="absolute bottom-0 -left-1.5 h-3.75 w-3">
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
      <div className="flex w-full items-start px-2.5 pt-1">
        <p className="font-[family-name:var(--font-akshar),sans-serif] text-[0.9375rem] font-semibold leading-5 text-[#075985]">
          {sender}
        </p>
      </div>
      <div className="flex w-full items-center justify-center pb-1.75 pl-2.5 pr-5 pt-1.5">
        <p className="flex-1 font-[Inter,sans-serif] text-[1rem] leading-5.5 text-[#2d3748]">
          {text}
        </p>
      </div>
    </div>
  );
}

function AdvisorAvatar() {
  return (
    <div className="absolute bottom-0 left-0 h-10 w-6 overflow-hidden rounded-full bg-[#e0f2fe]">
      <svg
        className="absolute bottom-1 left-0.75"
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
    <div className="flex w-full shrink-0 items-center gap-1.5">
      <div className="flex h-6.75 w-8.25 shrink-0 flex-col items-center justify-center p-1">
        <div className="flex items-center justify-center rounded-full p-2.75">
          <div className="h-4.5 w-4.5 rounded-xs border border-[#3b82f6]" />
        </div>
      </div>
      <p className="w-63 font-[Arial,sans-serif] text-[0.8125rem] leading-4 text-slate-900">
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
      <div className="flex flex-1 flex-col items-center justify-center px-3.5 py-1.5">
        <div className="relative w-full">
          <p className="mb-1 font-[Arial,sans-serif] text-[0.875rem] font-bold leading-normal text-[#2d3748]">
            Your Advisor, {advisorName}{" "}
            <span className="text-[0.75rem]">✨</span>
          </p>
          <div className="relative h-15">
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
