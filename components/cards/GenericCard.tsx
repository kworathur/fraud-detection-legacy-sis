import BaseCard from "./BaseCard";
import CardHeader from "./CardHeader";
import CardFooter from "./CardFooter";
import type { GenericCardProps } from "@/lib/types";

export default function GenericCard({
  title,
  subHeader,
  bodyHeading,
  bodyText,
  ctaText,
}: Readonly<GenericCardProps>) {
  return (
    <BaseCard
      header={<CardHeader title={title} />}
      contentClassName="gap-[0.3125rem]"
    >
      {subHeader && (
        <div className="flex shrink-0 items-start bg-white px-2.5 py-1.25">
          <div className="flex h-4.5 items-center justify-center py-0.25">
            <p className="font-[Arial,sans-serif] text-[0.9375rem] font-bold text-[#1e1e1e]">
              {subHeader}
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-1 shrink-0 flex-col gap-2.5 px-3.5">
        {bodyHeading && (
          <p className="font-[Arial,sans-serif] text-[0.875rem] font-bold leading-normal text-[#2d3748]">
            {bodyHeading}
          </p>
        )}
        {bodyText && (
          <p className="font-[Arial,sans-serif] text-[0.8125rem] leading-4 text-body-text">
            {bodyText}
          </p>
        )}
      </div>
      {ctaText && <CardFooter ctaText={ctaText} />}
    </BaseCard>
  );
}
