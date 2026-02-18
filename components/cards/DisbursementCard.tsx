import Image from "next/image";
import BaseCard from "./BaseCard";
import CardHeader from "./CardHeader";
import CardFooter from "./CardFooter";
import type { DisbursementCardProps } from "@/lib/types";

function AlertBody() {
  return (
    <div className="flex h-[146px] w-[309px] shrink-0 flex-col gap-[10px] px-[14px]">
      <p className="font-[family-name:Arial,sans-serif] text-[14px] font-bold leading-normal text-[#2d3748]">
        Hold Reasons:
      </p>
      <ul className="list-disc font-[family-name:Arial,sans-serif] text-[13px] leading-[16px] text-[#485568]">
        <li className="mb-0 ms-[19.5px]">
          Your disbursement is on hold for the following reasons:
        </li>
        <ul>
          <li className="mb-0 ms-[39px]">
            Excessive absences in ART 100
          </li>
          <li className="ms-[39px]">
            Additional proof required to verify home address.
          </li>
        </ul>
        <li className="mb-0 ms-[19.5px]">
          Hold placed on: <strong>January 28, 2026</strong>
        </li>
        <li className="ms-[19.5px]">
          Action required to release hold
        </li>
      </ul>
    </div>
  );
}

function InfoBody() {
  return (
    <div className="flex h-[146px] w-[309px] shrink-0 flex-col gap-[10px] px-[14px]">
      <p className="font-[family-name:Arial,sans-serif] text-[14px] font-bold leading-normal text-[#2d3748]">
        Details:
      </p>
      <ul className="list-disc font-[family-name:Arial,sans-serif] text-[13px] leading-[16px] text-[#485568]">
        <li className="mb-0 ms-[19.5px]">
          Your next scholarship payment is $<strong>2,500</strong> and will be deposited automatically on Feb 15th.
        </li>
        <li className="mb-0 ms-[19.5px]">
          Ensure that your direct deposit information is correct prior to the date above.
        </li>
        <li className="ms-[19.5px]">
          For alternative forms of payment, please contact{" "}
          <a href="#" className="text-[#3182ce] underline">the office of financial aid</a>.
        </li>
      </ul>
    </div>
  );
}

export default function DisbursementCard({
  variant,
  title,
  bannerText,
  ctaText,
}: Readonly<DisbursementCardProps>) {
  return (
    <BaseCard>
      <CardHeader title={title} />
      {variant === "alert" ? (
        <div className="flex h-[33px] shrink-0 items-start bg-[#fff2f0] px-[10px] py-[5px]">
          <div className="flex items-center gap-[10px] py-px">
            <div className="relative h-[20px] w-[20px]">
              <Image src="/images/warning-icon.svg" alt="" width={20} height={20} />
              <span className="absolute left-1/2 top-[2px] -translate-x-1/2 font-[family-name:Arial,sans-serif] text-[16px] font-bold text-white">
                !
              </span>
            </div>
            <p className="font-[family-name:Arial,sans-serif] text-[15px] font-bold text-[#900b09]">
              {bannerText}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex h-[33px] shrink-0 items-start bg-[#dcfce7] px-[10px] py-[5px]">
          <div className="flex h-[18px] items-center justify-center py-px">
            <p className="font-[family-name:Arial,sans-serif] text-[15px] font-bold text-[#14532d]">
              {bannerText}
            </p>
          </div>
        </div>
      )}
      {variant === "alert" ? <AlertBody /> : <InfoBody />}
      <CardFooter ctaText={ctaText} />
    </BaseCard>
  );
}
