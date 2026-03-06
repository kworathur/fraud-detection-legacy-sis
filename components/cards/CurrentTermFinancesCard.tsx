import BaseCard from './BaseCard';
import CardHeader from './CardHeader';
import CardFooter from './CardFooter';

const finances = {
    tuitionAndFees: '$12,450.00',
    scholarships: '-$5,000.00',
    payments: '-$3,725.00',
    balanceDue: '$3,725.00',
    dueDate: 'Mar 15, 2026',
};

export default function CurrentTermFinancesCard() {
    return (
        <BaseCard
            header={<CardHeader title="Current Term Finances" />}
            contentClassName="gap-2"
        >
            <div className="h-full flex flex-col gap-2 px-3.5 pt-1">
                <p className="font-sans text-[0.75rem] font-semibold text-[#8b8b8b]">
                    Spring 2026
                </p>
                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between font-sans text-[0.8125rem] text-[#292929]">
                        <span>Tuition & Fees</span>
                        <span className="font-semibold">
                            {finances.tuitionAndFees}
                        </span>
                    </div>
                    <div className="flex justify-between font-sans text-[0.8125rem] text-[#292929]">
                        <span>Scholarships</span>
                        <span className="font-semibold text-green-600">
                            {finances.scholarships}
                        </span>
                    </div>
                    <div className="flex justify-between font-sans text-[0.8125rem] text-[#292929]">
                        <span>Payments</span>
                        <span className="font-semibold text-green-600">
                            {finances.payments}
                        </span>
                    </div>
                    <hr className="border-[#e5e5e5]" />
                    <div className="flex justify-between font-sans text-[0.875rem] font-bold text-[#292929]">
                        <span>Balance Due</span>
                        <span>{finances.balanceDue}</span>
                    </div>
                    <p className="font-sans text-[0.75rem] text-[#8b8b8b]">
                        Due by {finances.dueDate}
                    </p>
                </div>
            </div>
            <CardFooter ctaText="MAKE A PAYMENT" />
        </BaseCard>
    );
}
