import BaseCard from './BaseCard';
import CardHeader from './CardHeader';
import CardFooter from './CardFooter';
import Alert from '@/components/ui/Alert';
import type { AdvisingCardProps } from '@/lib/types';

function ChatBubble({
    sender,
    text,
}: Readonly<{ sender: string; text: string }>) {
    return (
        <div className="relative flex w-full flex-col rounded-xl bg-[#f8fafc] shadow-[0_1px_1px_rgba(0,0,0,0.1)]">
            {/* Speech bubble tail — curves from the bubble's left wall down toward the avatar */}
            <svg
                className="absolute -bottom-[10px] left-0"
                width="12"
                height="15"
                viewBox="0 0 12 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12 0 L12 5 C12 10 6 14 0 15 C4 13 6 10 6 5 L6 0 Z"
                    fill="#f8fafc"
                />
                <path
                    d="M12 5 C12 10 6 14 0 15"
                    stroke="rgba(0,0,0,0.08)"
                    strokeWidth="0.5"
                />
            </svg>
            <div className="flex w-full items-start px-2.5 pt-1">
                <p className="font-[family-name:var(--font-akshar),sans-serif] text-[0.9375rem] font-semibold leading-5 text-[#075985]">
                    {sender}
                </p>
            </div>
            <div className="flex w-full items-center pb-[7px] pl-2.5 pr-5">
                <p className="flex-1 font-[Arial,sans-serif] text-[0.8125rem] leading-[22px] text-[#010101]">
                    {text}
                </p>
            </div>
        </div>
    );
}

function AdvisorAvatar() {
    return (
        <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-[#e0f2fe]">
            <svg
                width="16"
                height="16"
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
        <div className="flex h-12 w-full items-center gap-1.5">
            <div className="flex w-11 shrink-0 items-center justify-center">
                <div className="h-[18px] w-[18px] rounded-sm border border-[#3b82f6]" />
            </div>
            <p className="flex-1 font-[Arial,sans-serif] text-[0.8125rem] leading-4 text-slate-900">
                {text}
            </p>
        </div>
    );
}

export default function AdvisingCard({
    title,
    slotsLeft,
    chatMessage,
    actionItem,
    ctaText,
}: Readonly<AdvisingCardProps>) {
    return (
        <BaseCard header={<CardHeader title={title} />}>
            <Alert
                variant="info"
                text={`${slotsLeft} Advising Slots Left This Week!`}
            />
            <div className="flex flex-col items-center px-1.25 py-1">
                <div className="flex w-full items-end">
                    <div className="flex w-fit shrink-0 items-end justify-center pl-2.5">
                        <AdvisorAvatar />
                    </div>
                    <div className="flex flex-1 p-2.5 mb-3">
                        <ChatBubble
                            sender={chatMessage.sender}
                            text={chatMessage.text}
                        />
                    </div>
                </div>
                <CheckboxItem text={actionItem} />
            </div>
            <CardFooter ctaText={ctaText} ctaHref="/advising-meetings/new" />
        </BaseCard>
    );
}
