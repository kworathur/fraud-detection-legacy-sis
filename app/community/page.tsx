import Link from "next/link";
import { SmallNav } from "@/components/layout/Navbar";

export default function CommunityPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <SmallNav />
      <main className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8">
        <h1 className="font-[Arial,sans-serif] text-3xl font-bold text-black">
          Community
        </h1>
        <p className="font-[Arial,sans-serif] text-base text-[#404040]">
          Community is currently a placeholder view.
        </p>
        <Link href="/experience" className="text-sm font-bold text-link-blue">
          Back to dashboard
        </Link>
      </main>
    </div>
  );
}
