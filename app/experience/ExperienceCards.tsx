'use client';

import AssignedAdvisingCard from '@/components/cards/AssignedAdvisingCard';
import DisbursementCard from '@/components/cards/DisbursementCard';
import ClassesCard from '@/components/cards/ClassesCard';
import CurrentTermFinancesCard from '@/components/cards/CurrentTermFinancesCard';
import CampusRecEventsCard from '@/components/cards/CampusRecEventsCard';
import StudentDiscountsCard from '@/components/cards/StudentDiscountsCard';
import TransitServiceCard from '@/components/cards/TransitServiceCard';
import DayAtAGlanceCard from '@/components/cards/DayAtAGlanceCard';
import { useRole } from '@/lib/useRole';
import type { ClassesCardProps, DisbursementCardProps } from '@/lib/types';

export default function ExperienceCards({
    classesData,
    disbursementInfo,
}: Readonly<{
    classesData: ClassesCardProps;
    disbursementInfo: DisbursementCardProps;
}>) {
    const { loaded, isStudent } = useRole();

    return (
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(19.6875rem,19.6875rem))] content-start justify-center gap-6">
            {loaded && isStudent && <AssignedAdvisingCard />}

            <DisbursementCard {...disbursementInfo} />
            <CurrentTermFinancesCard />
            <DayAtAGlanceCard />
            <CampusRecEventsCard />
            <StudentDiscountsCard />
            <TransitServiceCard />
            <ClassesCard {...classesData} />
        </div>
    );
}
