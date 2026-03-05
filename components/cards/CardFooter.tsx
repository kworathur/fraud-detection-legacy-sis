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
    <div className="flex shrink-0 flex-col items-center justify-center px-2.75 py-2.5">
      <Button href={ctaHref} variant={variant}>
        {ctaText}
      </Button>
    </div>
  );
}
