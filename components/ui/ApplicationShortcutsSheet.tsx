import Image from 'next/image';
import Link from 'next/link';

export interface AppShortcut {
    id: string;
    label: string;
    icon: string;
    href: string;
    enabled: boolean;
}

export default function ApplicationShortcutsSheet({
    shortcuts,
    onClose,
}: Readonly<{
    shortcuts: AppShortcut[];
    onToggleEdit: () => void;
    onLabelChange: (shortcutId: string, nextLabel: string) => void;
    onEnabledChange: (shortcutId: string, enabled: boolean) => void;
    onClose: () => void;
}>) {
    const visibleShortcuts = shortcuts.filter((shortcut) => shortcut.enabled);
    const shortcutIconSrc = '/images/shortcut-item-icon.svg';

    return (
        <div className="flex h-full w-70.75 flex-col items-center bg-white">
            <div className="flex w-full items-center gap-2 p-5">
                <p className="flex-1 font-[Arial,sans-serif] text-[1rem] font-bold text-black">
                    Application Shortcuts
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close application shortcuts"
                >
                    <Image
                        src="/images/close-icon.svg"
                        alt=""
                        width={14}
                        height={14}
                        className="shrink-0"
                    />
                </button>
            </div>
            <div className="h-0 w-67.25 border-t border-[#d1d5db]" />
            <div className="flex w-full flex-col gap-3.25 py-3.75 pl-5.75 pr-2.5">
                {visibleShortcuts.map((shortcut) => (
                    <Link
                        key={shortcut.id}
                        href={shortcut.href}
                        onClick={onClose}
                        className="flex w-full items-center gap-4.75"
                    >
                        <Image
                            src={shortcutIconSrc}
                            alt=""
                            width={12}
                            height={12}
                            className="shrink-0"
                        />
                        <span className="font-[Arial,sans-serif] text-sm font-bold text-[#404040]">
                            {shortcut.label}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
