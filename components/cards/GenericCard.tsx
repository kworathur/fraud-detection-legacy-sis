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
    <BaseCard className="gap-[0.3125rem]">
      <CardHeader title={title} />
      {subHeader && (
        <div className="flex shrink-0 items-start bg-white px-[0.625rem] py-[0.3125rem]">
          <div className="flex h-[1.125rem] items-center justify-center py-[0.0625rem]">
            <p className="font-[family-name:Arial,sans-serif] text-[0.9375rem] font-bold text-[#1e1e1e]">
              {subHeader}
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-1 shrink-0 flex-col gap-[0.625rem] px-[0.875rem]">
        {bodyHeading && (
          <p className="font-[family-name:Arial,sans-serif] text-[0.875rem] font-bold leading-normal text-[#2d3748]">
            {bodyHeading}
          </p>
        )}
        {bodyText && (
          <p className="font-[family-name:Arial,sans-serif] text-[0.8125rem] leading-[1rem] text-[#485568]">
            {bodyText}
          </p>
        )}
      </div>
      {ctaText && <CardFooter ctaText={ctaText} />}
    </BaseCard>
  );
}
