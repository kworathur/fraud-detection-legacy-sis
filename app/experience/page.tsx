import Navbar from "@/components/layout/Navbar";
import NavLinks from "@/components/layout/NavLinks";
import AnnouncementCards from "@/components/cards/AnnouncementCarousel";
import DisbursementCard from "@/components/cards/DisbursementCard";
import ClassesCard from "@/components/cards/ClassesCard";
import GenericCard from "@/components/cards/GenericCard";
import {
  announcements,
  disbursementAlert,
  disbursementInfo,
  classesData,
  genericCardData,
  navLinks,
} from "@/lib/constants";

export default function ExperiencePage() {
  return (
    <div className="relative h-screen w-full bg-white">
      <div className="flex h-full w-full flex-col">
        {/* Experience Header */}
        <header className="h-[316px] shrink-0 bg-[#475569]">
          <div className="flex flex-col gap-[48px] px-[43px] pt-[34px]">
            <Navbar />
            <AnnouncementCards announcements={announcements} />
          </div>
        </header>

        {/* Navigation Links */}
        <NavLinks links={navLinks} />

        {/* Card Grid */}
        <section className="flex flex-wrap content-start gap-x-[24px] gap-y-[24px] px-[42px] py-[12px]">
          <DisbursementCard {...disbursementAlert} />
          <DisbursementCard {...disbursementInfo} />
          <ClassesCard {...classesData} />
          <GenericCard {...genericCardData} />
        </section>
      </div>
    </div>
  );
}
