import BaseCard from "./BaseCard";
import CardHeader from "./CardHeader";

const schedule = [
  { time: "8:00 AM", event: "ART 100 - Online Lecture", type: "class" as const },
  { time: "10:30 AM", event: "Advisor Check-in", type: "meeting" as const },
  { time: "12:00 PM", event: "Study Group - Library Rm 204", type: "other" as const },
  { time: "2:00 PM", event: "CS 201 - Lab Session", type: "class" as const },
  { time: "5:00 PM", event: "Intramural Soccer", type: "other" as const },
];

const typeColors = {
  class: "bg-blue-100 border-blue-400",
  meeting: "bg-amber-50 border-amber-400",
  other: "bg-gray-100 border-gray-400",
};

export default function DayAtAGlanceCard() {
  return (
    <BaseCard
      header={<CardHeader title="Day at a Glance" />}
      contentClassName="gap-1"
    >
      <div className="flex flex-col gap-0 px-3.5 pt-1">
        <p className="mb-2 font-sans text-[0.75rem] font-semibold text-[#8b8b8b]">
          Thursday, Mar 6
        </p>
        {schedule.map((item) => (
          <div
            key={item.time}
            className={`flex items-start gap-3 border-l-2 py-1.5 pl-3 ${typeColors[item.type]}`}
          >
            <span className="w-16 shrink-0 font-sans text-[0.75rem] font-semibold text-[#8b8b8b]">
              {item.time}
            </span>
            <span className="font-sans text-[0.8125rem] font-semibold text-[#292929]">
              {item.event}
            </span>
          </div>
        ))}
      </div>
    </BaseCard>
  );
}
