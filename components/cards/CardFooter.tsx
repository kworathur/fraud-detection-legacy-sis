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
    <div className="flex h-11 shrink-0 items-center justify-center">
      <Button href={ctaHref} variant={variant}>
        {ctaText}
      </Button>
    </div>
  );
}
