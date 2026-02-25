import Image from "next/image";

export interface AppShortcut {
  label: string;
  icon: string;
}

export default function ApplicationShortcutsSheet({
  shortcuts,
}: Readonly<{
  shortcuts: AppShortcut[];
}>) {
  return (
    <div className="flex w-[17.6875rem] flex-col items-center bg-white">
      <div className="flex w-full items-center justify-center p-[1.25rem]">
        <p className="flex-1 font-[family-name:Arial,sans-serif] text-[1rem] font-bold text-black">
          Application Shortcuts
        </p>
      </div>
      <div className="h-0 w-[16.8125rem] border-t border-[#d1d5db]" />
      <div className="flex w-full flex-col gap-[0.8125rem] py-[0.9375rem] pl-[1.4375rem] pr-[0.625rem]">
        {shortcuts.map((shortcut) => (
          <a
            key={shortcut.label}
            href="#"
            className="flex w-full items-center gap-[1.1875rem]"
          >
            <Image
              src={shortcut.icon}
              alt=""
              width={13}
              height={13}
              className="shrink-0"
            />
            <span className="font-[family-name:Arial,sans-serif] text-[0.75rem] font-bold text-[#404040]">
              {shortcut.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
