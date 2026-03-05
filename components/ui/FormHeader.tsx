export default function FormHeader({
  title,
}: Readonly<{
  title: string;
}>) {
  return (
    <div className="flex h-[2.75rem] w-full items-center border-b border-[#d1d5db] bg-white pb-[0.625rem] pl-[0.9375rem] pr-[0.625rem] pt-[0.0625rem]">
      <p className="font-[family-name:Arial,sans-serif] text-[1.125rem] font-bold leading-none text-black">
        {title}
      </p>
    </div>
  );
}
