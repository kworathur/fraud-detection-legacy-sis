import BaseCard from './BaseCard';
import CardHeader from './CardHeader';
import CardFooter from './CardFooter';

const routes = [
    {
        name: 'Gold Route',
        status: 'On Time',
        nextArrival: '3:12 PM',
        stop: 'College of Computing Building',
    },
    {
        name: 'Clough Route',
        status: 'Delayed 5 min',
        nextArrival: '3:25 PM',
        stop: 'Clough Undergraduate',
    },
    {
        name: 'Red Route',
        status: 'On Time',
        nextArrival: '3:40 PM',
        stop: 'Recreation Center',
    },
];

export default function TransitServiceCard() {
    return (
        <BaseCard
            header={<CardHeader title="Stinger Tracker" />}
            contentClassName="gap-2"
        >
            <div className="h-full flex flex-col gap-2.5 px-3.5 pt-1">
                {routes.map((route) => (
                    <div
                        key={route.name}
                        className="flex items-center justify-between border-b border-[#e5e5e5] pb-2 last:border-b-0"
                    >
                        <div className="flex flex-col gap-0.5">
                            <p className="font-sans text-[0.8125rem] font-semibold text-[#292929]">
                                {route.name}
                            </p>
                            <p className="font-sans text-[0.6875rem] text-[#8b8b8b]">
                                Next at {route.stop}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                            <p className="font-sans text-[0.8125rem] font-semibold text-[#292929]">
                                {route.nextArrival}
                            </p>
                            <p
                                className={`font-sans text-[0.6875rem] font-semibold ${
                                    route.status === 'On Time'
                                        ? 'text-green-600'
                                        : 'text-amber-500'
                                }`}
                            >
                                {route.status}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <CardFooter ctaText="VIEW FULL MAP" />
        </BaseCard>
    );
}
