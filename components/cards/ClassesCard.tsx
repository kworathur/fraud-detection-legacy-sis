import Image from "next/image";
import TermSelector from "./TermSelector";
import type { ClassesCardProps } from "@/lib/types";

export default function ClassesCard({
  title,
  term,
  courses,
}: Readonly<ClassesCardProps>) {
  return (
    <div className="flex h-[296px] w-[315px] shrink-0 flex-col gap-[10px] rounded bg-white px-[14px] py-[16px] shadow-[0_0_32px_rgba(0,0,0,0.25)]">
      {/* Card Header */}
      <div className="relative inline-grid shrink-0">
        <p className="font-sans text-[15px] font-semibold tracking-[0.6px] text-[#292929]">
          {title}
        </p>
        <div className="absolute right-0 top-0 flex items-center gap-1">
          <button type="button" className="flex h-6 w-6 items-center justify-center">
            <Image src="/images/more-vert.svg" alt="" width={3} height={11} />
          </button>
          <Image src="/images/lock-icon.svg" alt="" width={11} height={12} />
        </div>
      </div>
      {/* Card Body */}
      <div className="relative flex-1">
        <div className="flex items-center">
          <TermSelector defaultTerm={term} />
          <div className="ml-auto">
            <Image src="/images/refresh-icon.svg" alt="Refresh" width={16} height={15} />
          </div>
        </div>
        {courses.map((course) => (
          <div key={course.code} className="mt-3">
            <a
              href="#"
              className="font-sans text-[13px] font-semibold tracking-[-0.13px] text-[#3182ce] underline"
            >
              {course.code} {course.title}
            </a>
            <p className="mt-1 font-sans text-[12px] font-semibold tracking-[-0.12px] text-black">
              {course.modality}
            </p>
            <p className="font-sans text-[11px] font-semibold tracking-[-0.11px] text-[#8b8b8b]">
              {course.dateRange}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
