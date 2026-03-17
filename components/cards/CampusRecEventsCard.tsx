import BaseCard from './BaseCard';
import CardHeader from './CardHeader';
import CardFooter from './CardFooter';

const events = [
    {
        name: 'Rec Swim',
        location: 'Aquatic Center',
        time: '3:00 PM - 5:00 PM',
    },
    {
        name: 'Intramural Basketball',
        location: 'Recreation Center Gym B',
        time: '6:00 PM - 8:00 PM',
    },
    {
        name: 'Yoga Group Fitness',
        location: 'Wellness Studio 2',
        time: '7:30 AM - 8:30 AM',
    },
];

export default function CampusRecEventsCard() {
    return (
        <BaseCard
            header={<CardHeader title="Campus Recreation Events" />}
            contentClassName="gap-2"
        >
            <div className="flex flex-col gap-3 px-3.5 pt-1">
                <p className="font-sans text-[0.75rem] font-semibold text-[#8b8b8b]">
                    Today, Mar 6
                </p>
                {events.map((event) => (
                    <div key={event.name} className="flex flex-col gap-0.5">
                        <a
                            href="#"
                            className="font-sans text-[0.8125rem] font-semibold text-link-blue underline"
                        >
                            {event.name}
                        </a>
                        <p className="font-sans text-[0.75rem] font-semibold text-black">
                            {event.location}
                        </p>
                        <p className="font-sans text-[0.6875rem] font-semibold text-[#8b8b8b]">
                            {event.time}
                        </p>
                    </div>
                ))}
            </div>
            <CardFooter ctaText="VIEW ALL EVENTS" />
        </BaseCard>
    );
}
