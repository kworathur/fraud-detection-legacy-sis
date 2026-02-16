import BaseCard from "./BaseCard";
import CardHeader from "./CardHeader";
import CardFooter from "./CardFooter";
import type { AdvisingCardProps } from "@/lib/types";

function InfoBanner({ slotsLeft }: Readonly<{ slotsLeft: number }>) {
  return (
    <div className="flex h-[48px] w-[315px] shrink-0 flex-col items-start bg-[#e0f2fe]">
      <div className="h-[5px] w-full bg-[#075985]" />
      <div className="flex h-[28px] w-full items-center justify-center p-[4px]">
        <p className="font-[family-name:Arial,sans-serif] text-[15px] font-bold leading-normal text-[#075985]">
          {slotsLeft} Virtual Advising Slots Left!
        </p>
      </div>
    </div>
  );
}

function ChatBubble({
  sender,
  text,
}: Readonly<{ sender: string; text: string }>) {
  return (
    <div className="relative flex w-[287px] flex-col items-start rounded-[12px] bg-white shadow-[0_1px_1px_rgba(0,0,0,0.1)]">
      {/* Bubble tail */}
      <div className="absolute bottom-0 left-[-6px] h-[15px] w-[12px]">
        <svg
          width="12"
          height="15"
          viewBox="0 0 12 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 15C5.5 15 1 11.5 0 5V15H11Z" fill="white" />
        </svg>
      </div>
      {/* Sender */}
      <div className="flex w-full items-start px-[10px] pt-[4px]">
        <p className="font-[family-name:Inter,sans-serif] text-[15px] font-semibold leading-[20px] text-[#cb9c00]">
          {sender}
        </p>
      </div>
      {/* Message */}
      <div className="flex w-full items-center justify-center pb-[7px] pl-[10px] pr-[20px] pt-[6px]">
        <p className="flex-1 font-[family-name:Inter,sans-serif] text-[16px] leading-[22px] text-[#2d3748]">
          {text}
        </p>
      </div>
    </div>
  );
}

function CheckboxItem({ text }: Readonly<{ text: string }>) {
  return (
    <div className="flex h-[46px] w-full shrink-0 items-center gap-[6px]">
      <div className="flex h-[27px] w-[33px] shrink-0 flex-col items-center justify-center p-[4px]">
        <div className="relative flex items-center justify-center">
          <div className="h-[18px] w-[18px] rounded-[2px] bg-[#3b82f6]" />
          <svg
            className="absolute"
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 5L5.5 9L12.5 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <p className="w-[252px] font-[family-name:Arial,sans-serif] text-[14px] leading-[16px] text-[#0f172a]">
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
    <BaseCard className="gap-[5px]">
      <CardHeader title={title} />
      <InfoBanner slotsLeft={slotsLeft} />
      <div className="flex h-[146px] w-full shrink-0 flex-col gap-[6px] px-[14px]">
        <p className="font-[family-name:Arial,sans-serif] text-[14px] font-bold leading-normal text-[#2d3748]">
          Your Advisor: {advisorName}
        </p>
        <ChatBubble sender={chatMessage.sender} text={chatMessage.text} />
        <CheckboxItem text={actionItem} />
      </div>
      <CardFooter ctaText={ctaText} />
    </BaseCard>
  );
}
