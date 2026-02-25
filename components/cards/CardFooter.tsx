import Button from "@/components/ui/Button";

export default function CardFooter({
  ctaText,
  ctaHref,
  variant = "primary",
}: Readonly<{
  ctaText: string;
  ctaHref?: string;
  variant?: "primary" | "secondary" | "warning";
}>) {
  return (
    <div className="flex shrink-0 flex-col items-center justify-center px-[0.6875rem] py-[0.625rem]">
      <Button href={ctaHref} variant={variant}>
        {ctaText}
      </Button>
    </div>
  );
}
