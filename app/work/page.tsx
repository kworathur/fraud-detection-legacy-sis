import Link from "next/link";
import { SmallNav } from "@/components/layout/Navbar";

export default function WorkPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <SmallNav />
      <main className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8">
        <h1 className="font-[family-name:Arial,sans-serif] text-3xl font-bold text-black">
          Work
        </h1>
        <p className="font-[family-name:Arial,sans-serif] text-base text-[#404040]">
          Work is currently a placeholder view.
        </p>
        <Link href="/experience" className="text-sm font-bold text-link-blue">
          Back to dashboard
        </Link>
      </main>
    </div>
  );
}
