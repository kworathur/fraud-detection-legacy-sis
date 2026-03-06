import Navbar from "@/components/layout/Navbar";
import NavLinks from "@/components/layout/NavLinks";
import AnnouncementCards from "@/components/cards/AnnouncementCarousel";
import ExperienceCards from "./ExperienceCards";
import {
  announcements,
  disbursementInfo,
  classesData,
  navLinks,
} from "@/lib/constants";

export default function ExperiencePage() {
  return (
    <div className="relative min-h-screen w-full bg-white">
      <div className="flex min-h-screen w-full flex-col">
        {/* Experience Header with background image */}
        <header className="relative bg-white px-10 py-7">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/header-bg.jpg')" }}
          />
          <div className="relative flex flex-col gap-5">
            <Navbar />
            <AnnouncementCards announcements={announcements} />
          </div>
        </header>

        {/* Navigation Links */}
        <NavLinks links={navLinks} />

        {/* Card Grid */}
        <section className="flex-1 bg-card-grid-bg p-10 pt-3">
          <ExperienceCards
            classesData={classesData}
            disbursementInfo={disbursementInfo}
          />
        </section>
      </div>
    </div>
  );
}
