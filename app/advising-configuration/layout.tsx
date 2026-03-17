import { SmallNav } from "@/components/layout/Navbar";
import FormHeader from "@/components/ui/FormHeader";
import AdvisingConfigurationSubmenu from "./AdvisingConfigurationSubmenu";

export default function AdvisingConfigurationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full flex-col bg-white">
      <SmallNav />
      <FormHeader title="Advising Configuration" />

      <div className="flex flex-1 overflow-hidden">
        <AdvisingConfigurationSubmenu />
        {children}
      </div>
    </div>
  );
}
