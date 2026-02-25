import BaseCard from "./BaseCard";
import CardHeader from "./CardHeader";
import CardFooter from "./CardFooter";
import Alert from "@/components/ui/Alert";
import type { DisbursementCardProps } from "@/lib/types";

function AlertBody() {
  return (
    <div className="flex flex-1 shrink-0 flex-col gap-[0.625rem] px-[0.875rem]">
      <p className="font-[family-name:Arial,sans-serif] text-[0.875rem] font-bold leading-normal text-[#2d3748]">
        Hold Reasons:
      </p>
      <ul className="list-disc font-[family-name:Arial,sans-serif] text-[0.8125rem] leading-[1rem] text-[#485568]">
        <li className="mb-0 ms-[1.21875rem]">
          Your disbursement is on hold for the following reasons:
        </li>
        <ul>
          <li className="mb-0 ms-[2.4375rem]">
            Excessive absences in ART 100
          </li>
          <li className="ms-[2.4375rem]">
            Additional proof required to verify home address.
          </li>
        </ul>
        <li className="mb-0 ms-[1.21875rem]">
          Hold placed on: <strong>January 28, 2026</strong>
        </li>
        <li className="ms-[1.21875rem]">Action required to release hold</li>
      </ul>
    </div>
  );
}

function InfoBody() {
  return (
    <div className="flex flex-1 shrink-0 flex-col gap-[0.625rem] px-[0.875rem]">
      <p className="font-[family-name:Arial,sans-serif] text-[0.875rem] font-bold leading-normal text-[#2d3748]">
        Details:
      </p>
      <ul className="list-disc font-[family-name:Arial,sans-serif] text-[0.8125rem] leading-[1rem] text-[#485568]">
        <li className="mb-0 ms-[1.21875rem]">
          Your next scholarship payment is $<strong>2,500</strong> and will be
          deposited automatically on Feb 15th.
        </li>
        <li className="mb-0 ms-[1.21875rem]">
          Ensure that your direct deposit information is correct prior to the
          date above.
        </li>
        <li className="ms-[1.21875rem]">
          For alternative forms of payment, please contact{" "}
          <a href="#" className="text-[#3182ce] underline">
            the office of financial aid
          </a>
          .
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
    <BaseCard className="gap-[0.3125rem]">
      <CardHeader title={title} />
      <Alert
        variant={variant === "alert" ? "warning" : "success"}
        text={bannerText}
      />
      {variant === "alert" ? <AlertBody /> : <InfoBody />}
      <CardFooter ctaText={ctaText} />
    </BaseCard>
  );
}
