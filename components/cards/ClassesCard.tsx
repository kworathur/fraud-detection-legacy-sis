import Image from "next/image";
import TermSelector from "./TermSelector";
import type { ClassesCardProps } from "@/lib/types";

export default function ClassesCard({
  title,
  term,
  courses,
}: Readonly<ClassesCardProps>) {
  return (
    <div className="flex h-[18.5rem] w-[19.6875rem] shrink-0 flex-col gap-[0.625rem] rounded-[0.25rem] bg-white px-[0.875rem] py-[1rem] shadow-[0_0_2rem_rgba(0,0,0,0.25)]">
      <div className="relative flex shrink-0 items-center">
        <p className="font-sans text-[0.9375rem] font-semibold tracking-[0.0375rem] text-[#292929]">
          {title}
        </p>
        <div className="ml-auto flex items-center gap-[0.25rem]">
          <Image src="/images/lock-icon.svg" alt="" width={11} height={12} />
          <button
            type="button"
            className="flex h-[1.5rem] w-[1.5rem] items-center justify-center"
          >
            <Image src="/images/more-vert.svg" alt="" width={3} height={11} />
          </button>
        </div>
      </div>
      <div className="relative flex-1">
        <div className="flex items-center">
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
          <div key={course.code} className="mt-[0.75rem]">
            <a
              href="#"
              className="font-sans text-[0.8125rem] font-semibold tracking-[-0.008125rem] text-[#3182ce] underline"
            >
              {course.code} {course.title}
            </a>
            <p className="mt-[0.25rem] font-sans text-[0.75rem] font-semibold tracking-[-0.0075rem] text-black">
              {course.modality}
            </p>
            <p className="font-sans text-[0.6875rem] font-semibold tracking-[-0.006875rem] text-[#8b8b8b]">
              {course.dateRange}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
