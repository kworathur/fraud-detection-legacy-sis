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
    <BaseCard>
      <CardHeader title={title} />
      <div className="flex h-[33px] shrink-0 items-start bg-white px-[10px] py-[5px]">
        <div className="flex h-[18px] w-[291px] items-center justify-center py-px">
          <p className="font-[family-name:Arial,sans-serif] text-[15px] font-bold text-[#1e1e1e]">
            {subHeader}
          </p>
        </div>
      </div>
      <div className="flex h-[146px] w-[309px] shrink-0 flex-col gap-[10px] px-[14px]">
        {bodyHeading && (
          <p className="font-[family-name:Arial,sans-serif] text-[14px] font-bold leading-normal text-[#2d3748]">
            {bodyHeading}
          </p>
        )}
        {bodyText && (
          <p className="font-[family-name:Arial,sans-serif] text-[13px] leading-[16px] text-[#485568]">
            {bodyText}
          </p>
        )}
      </div>
      {ctaText && <CardFooter ctaText={ctaText} />}
    </BaseCard>
  );
}
