import { SmallNav } from "@/components/layout/Navbar";
import FormHeader from "@/components/ui/FormHeader";
import AdvisingHomeSubmenu from "./AdvisingHomeSubmenu";

export default function AdvisingHomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full flex-col bg-white">
      <SmallNav />
      <FormHeader title="Advising Home" />

      <div className="flex flex-1 overflow-hidden">
        <AdvisingHomeSubmenu />
        {children}
      </div>
    </div>
  );
}
