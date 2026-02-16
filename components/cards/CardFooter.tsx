import Button from "@/components/ui/Button";

export default function CardFooter({
  ctaText,
  ctaHref,
}: Readonly<{
  ctaText: string;
  ctaHref?: string;
}>) {
  return (
    <div className="flex h-[50px] shrink-0 flex-col items-center justify-center px-[11px] py-[10px]">
      <Button href={ctaHref}>{ctaText}</Button>
    </div>
  );
}
