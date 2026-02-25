import Navbar from "@/components/layout/Navbar";
import NavLinks from "@/components/layout/NavLinks";
import AnnouncementCards from "@/components/cards/AnnouncementCarousel";
import AdvisingCard from "@/components/cards/AdvisingCard";
import DisbursementCard from "@/components/cards/DisbursementCard";
import ClassesCard from "@/components/cards/ClassesCard";
import {
  announcements,
  advisingCardData,
  disbursementInfo,
  classesData,
  navLinks,
} from "@/lib/constants";

export default function ExperiencePage() {
  return (
    <div className="relative min-h-screen w-full bg-white">
      <div className="flex w-full flex-col">
        {/* Experience Header with background image */}
        <header className="relative bg-white px-[2.625rem] py-[1.75rem]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/header-bg.svg')" }}
          />
          <div className="relative flex flex-col gap-[1.25rem]">
            <Navbar />
            <AnnouncementCards announcements={announcements} />
          </div>
        </header>

        {/* Navigation Links */}
        <NavLinks links={navLinks} />

        {/* Card Grid */}
        <section className="flex flex-wrap content-start gap-x-[1.5rem] gap-y-[1.5rem] bg-[#f5f5f5] px-[2.625rem] py-[0.75rem]">
          <AdvisingCard {...advisingCardData} />
          <ClassesCard {...classesData} />
          <DisbursementCard {...disbursementInfo} />
        </section>
      </div>
    </div>
  );
}
