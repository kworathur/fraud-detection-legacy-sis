import Image from 'next/image';
import TermSelector from './TermSelector';
import BaseCard from './BaseCard';
import CardHeader from './CardHeader';
import type { ClassesCardProps } from '@/lib/types';

export default function ClassesCard({
    title,
    term,
    courses,
}: Readonly<ClassesCardProps>) {
    return (
        <BaseCard header={<CardHeader title={title} />}>
            <div className="relative flex-1 px-3.5">
                <div className="flex items-center pt-0.5">
                    <TermSelector defaultTerm={term} />
                    <div className="ml-auto">
                        <Image
                            src="/images/refresh-icon.svg"
                            alt="Refresh"
                            width={16}
                            height={15}
                        />
                    </div>
                </div>
                {courses.map((course) => (
                    <div key={course.code} className="mt-3">
                        <a
                            href="#"
                            className="font-sans text-[0.8125rem] font-semibold tracking-[-0.008125rem] text-link-blue underline"
                        >
                            {course.code} {course.title}
                        </a>
                        <p className="mt-1 font-sans text-[0.75rem] font-semibold tracking-[-0.0075rem] text-black">
                            {course.modality}
                        </p>
                        <p className="font-sans text-[0.6875rem] font-semibold tracking-[-0.006875rem] text-[#8b8b8b]">
                            {course.dateRange}
                        </p>
                    </div>
                ))}
            </div>
        </BaseCard>
    );
}
