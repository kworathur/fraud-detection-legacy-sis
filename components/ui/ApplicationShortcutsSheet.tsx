import Image from "next/image";
import Link from "next/link";

export interface AppShortcut {
  id: string;
  label: string;
  icon: string;
  href: string;
  enabled: boolean;
}

export default function ApplicationShortcutsSheet({
  shortcuts,
  isEditing,
  onToggleEdit,
  onLabelChange,
  onEnabledChange,
  onClose,
}: Readonly<{
  shortcuts: AppShortcut[];
  isEditing: boolean;
  onToggleEdit: () => void;
  onLabelChange: (shortcutId: string, nextLabel: string) => void;
  onEnabledChange: (shortcutId: string, enabled: boolean) => void;
  onClose: () => void;
}>) {
  const visibleShortcuts = shortcuts.filter((shortcut) => shortcut.enabled);
  const shortcutIconSrc = "/images/shortcut-item-icon.svg";

  return (
    <div className="flex h-full w-[17.6875rem] flex-col items-center bg-white">
      <div className="flex w-full items-center gap-2 p-[1.25rem]">
        <p className="flex-1 font-[family-name:Arial,sans-serif] text-[1rem] font-bold text-black">
          Application Shortcuts
        </p>
        <button
          type="button"
          onClick={onToggleEdit}
          className="flex items-center gap-1 text-[0.75rem] font-bold text-link-blue"
          aria-pressed={isEditing}
        >
          <Image
            src="/images/edit-icon.svg"
            alt=""
            width={12}
            height={12}
            className="shrink-0"
          />
          {isEditing ? "Done" : "Edit"}
        </button>
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
      <div className="h-0 w-[16.8125rem] border-t border-[#d1d5db]" />
      <div className="flex w-full flex-col gap-[0.8125rem] py-[0.9375rem] pl-[1.4375rem] pr-[0.625rem]">
        {isEditing
          ? shortcuts.map((shortcut) => (
              <div key={shortcut.id} className="flex w-full items-center gap-2">
                <Image
                  src={shortcutIconSrc}
                  alt=""
                  width={12}
                  height={12}
                  className="shrink-0"
                />
                <input
                  value={shortcut.label}
                  onChange={(event) =>
                    onLabelChange(shortcut.id, event.target.value)
                  }
                  className="h-7 min-w-0 flex-1 border border-[#d1d5db] px-2 text-[0.75rem] font-bold text-[#404040] outline-none focus:border-link-blue"
                  aria-label={`Shortcut label for ${shortcut.id}`}
                />
                <label className="flex items-center gap-1 text-[0.6875rem] text-[#404040]">
                  <input
                    type="checkbox"
                    checked={shortcut.enabled}
                    onChange={(event) =>
                      onEnabledChange(shortcut.id, event.target.checked)
                    }
                  />
                  Show
                </label>
              </div>
            ))
          : visibleShortcuts.map((shortcut) => (
              <Link
                key={shortcut.id}
                href={shortcut.href}
                onClick={onClose}
                className="flex w-full items-center gap-[1.1875rem]"
              >
                <Image
                  src={shortcutIconSrc}
                  alt=""
                  width={12}
                  height={12}
                  className="shrink-0"
                />
                <span className="font-[family-name:Arial,sans-serif] text-[0.75rem] font-bold text-[#404040]">
                  {shortcut.label}
                </span>
              </Link>
            ))}
      </div>
    </div>
  );
}
