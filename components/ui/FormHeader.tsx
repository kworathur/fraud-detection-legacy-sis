export default function FormHeader({
  title,
}: Readonly<{
  title: string;
}>) {
  return (
    <div className="flex h-11 w-full items-center border-b border-[#d1d5db] bg-white pb-2.5 pl-3.75 pr-2.5 pt-0.25">
      <p className="font-[Arial,sans-serif] text-[1.125rem] font-bold leading-none text-black">
        {title}
      </p>
    </div>
  );
}
