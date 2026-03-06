import BaseCard from "./BaseCard";
import CardHeader from "./CardHeader";
import CardFooter from "./CardFooter";

const discounts = [
  { vendor: "Campus Bookstore", discount: "15% off textbooks", expires: "Apr 30, 2026" },
  { vendor: "Tech Hub", discount: "Free Adobe Creative Cloud", expires: "May 30, 2026" },
  { vendor: "Dining Services", discount: "$5 off meal plan add-on", expires: "Mar 20, 2026" },
];

export default function StudentDiscountsCard() {
  return (
    <BaseCard
      header={<CardHeader title="Student Discounts" />}
      contentClassName="gap-2"
    >
      <div className="flex flex-col gap-3 px-3.5 pt-1">
        {discounts.map((d) => (
          <div
            key={d.vendor}
            className="flex flex-col gap-0.5 rounded border border-[#e5e5e5] p-2"
          >
            <p className="font-sans text-[0.8125rem] font-semibold text-[#292929]">
              {d.vendor}
            </p>
            <p className="font-sans text-[0.75rem] text-link-blue">
              {d.discount}
            </p>
            <p className="font-sans text-[0.6875rem] text-[#8b8b8b]">
              Expires {d.expires}
            </p>
          </div>
        ))}
      </div>
      <CardFooter ctaText="VIEW ALL DISCOUNTS" />
    </BaseCard>
  );
}
