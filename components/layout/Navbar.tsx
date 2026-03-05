"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import ApplicationShortcutsSheet, {
  type AppShortcut,
} from "@/components/ui/ApplicationShortcutsSheet";

const SHORTCUTS_STORAGE_KEY = "app-shortcuts.v1";

async function signOutFromCognito() {
  await signOut({ redirect: false });
  window.location.href = "/api/auth/cognito-logout?returnTo=/login";
}

const BASE_APP_SHORTCUTS: AppShortcut[] = [
  {
    id: "home",
    label: "Home",
    icon: "/images/bookmark.svg",
    href: "/experience",
    enabled: true,
  },
  {
    id: "academic-services",
    label: "Academic Services",
    icon: "/images/clipboard-icon.svg",
    href: "/academic-services",
    enabled: true,
  },
  {
    id: "community",
    label: "Community",
    icon: "/images/info-icon.svg",
    href: "/community",
    enabled: true,
  },
  {
    id: "student-financials",
    label: "Student Financials",
    icon: "/images/lock-icon.svg",
    href: "/student-financials",
    enabled: true,
  },
  {
    id: "work",
    label: "Work",
    icon: "/images/search-icon.svg",
    href: "/work",
    enabled: true,
  },
  {
    id: "fraud-detection",
    label: "Fraud Detection",
    icon: "/images/warning-icon.svg",
    href: "/fraud-detection",
    enabled: true,
  },
  {
    id: "insight-designer",
    label: "Insight Designer",
    icon: "/images/edit-icon.svg",
    href: "/insight-designer",
    enabled: true,
  },
  {
    id: "advising-meetings",
    label: "Advising Meetings",
    icon: "/images/calendar-icon.svg",
    href: "/advising-meetings",
    enabled: true,
  },
];

const ADVISING_CONFIGURATION_SHORTCUT: AppShortcut = {
  id: "advising-configuration",
  label: "Advising Configuration",
  icon: "/images/info-icon.svg",
  href: "/advising-configuration",
  enabled: true,
};

function getDefaultShortcuts(canConfigureAdvising: boolean): AppShortcut[] {
  return canConfigureAdvising
    ? [...BASE_APP_SHORTCUTS, ADVISING_CONFIGURATION_SHORTCUT]
    : BASE_APP_SHORTCUTS;
}

function NavQuickActions({
  onAppsClick,
  onProfileClick,
}: Readonly<{
  onAppsClick?: () => void;
  onProfileClick?: () => void;
}>) {
  return (
    <div className="flex items-center gap-[1.875rem]">
      <button type="button" className="relative">
        <Image
          src="/images/calendar-icon.svg"
          alt="Calendar"
          width={20}
          height={22}
        />
        <Image
          src="/images/calendar-check.svg"
          alt=""
          width={10}
          height={7}
          className="absolute left-[0.3125rem] top-[0.625rem]"
        />
      </button>
      <button type="button">
        <Image
          src="/images/bell-icon.svg"
          alt="Notifications"
          width={19}
          height={25}
        />
      </button>
      <button
        type="button"
        aria-label="Open application shortcuts"
        onClick={onAppsClick}
        className="cursor-pointer"
      >
        <Image src="/images/grid-icon.svg" alt="Apps" width={21} height={20} />
      </button>
      <button
        type="button"
        aria-label="Open profile details"
        onClick={onProfileClick}
        className="relative cursor-pointer"
      >
        <Image
          src="/images/avatar.svg"
          alt="User avatar"
          width={37}
          height={38}
        />
        <span className="absolute inset-0 flex items-center justify-center font-[family-name:Arial,sans-serif] text-[1.125rem] font-bold text-[#4a5568]">
          J
        </span>
      </button>
    </div>
  );
}

function ShortcutsOverlay({
  isOpen,
  onClose,
  shortcuts,
  isEditing,
  onToggleEdit,
  onLabelChange,
  onEnabledChange,
}: Readonly<{
  isOpen: boolean;
  onClose: () => void;
  shortcuts: AppShortcut[];
  isEditing: boolean;
  onToggleEdit: () => void;
  onLabelChange: (shortcutId: string, nextLabel: string) => void;
  onEnabledChange: (shortcutId: string, enabled: boolean) => void;
}>) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close application shortcuts"
        className="absolute inset-0 bg-black/25"
        onClick={onClose}
      />
      <div className="relative h-full shadow-[-8px_0_20px_rgba(0,0,0,0.12)]">
        <ApplicationShortcutsSheet
          shortcuts={shortcuts}
          isEditing={isEditing}
          onToggleEdit={onToggleEdit}
          onLabelChange={onLabelChange}
          onEnabledChange={onEnabledChange}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

function ProfileOverlay({
  isOpen,
  onClose,
}: Readonly<{ isOpen: boolean; onClose: () => void }>) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close profile details"
        className="absolute inset-0 bg-black/25"
        onClick={onClose}
      />
      <div className="relative h-full w-[17.6875rem] bg-white shadow-[-8px_0_20px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between p-[1.25rem]">
          <p className="font-[family-name:Arial,sans-serif] text-[1rem] font-bold text-black">
            Profile Details
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile details"
          >
            <Image src="/images/close-icon.svg" alt="" width={14} height={14} />
          </button>
        </div>
        <div className="h-0 w-[16.8125rem] border-t border-[#d1d5db]" />
        <div className="flex w-full flex-col gap-[0.8125rem] py-[0.9375rem] pl-[1.4375rem] pr-[0.625rem]">
          <button
            type="button"
            onClick={() => void signOutFromCognito()}
            className="flex w-full items-center gap-[1.1875rem]"
          >
            <Image
              src="/images/logout-icon.svg"
              alt=""
              width={12}
              height={12}
              className="shrink-0"
            />
            <span className="font-[family-name:Arial,sans-serif] text-[0.75rem] font-bold text-[#404040]">
              Log Out
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function readStoredShortcuts(defaultShortcuts: AppShortcut[]): AppShortcut[] {
  if (typeof window === "undefined") {
    return defaultShortcuts;
  }

  const raw = window.localStorage.getItem(SHORTCUTS_STORAGE_KEY);
  if (!raw) {
    return defaultShortcuts;
  }

  try {
    const parsed = JSON.parse(raw) as Array<
      Pick<AppShortcut, "id" | "label" | "enabled">
    >;
    const byId = new Map(parsed.map((shortcut) => [shortcut.id, shortcut]));

    return defaultShortcuts.map((shortcut) => {
      const storedShortcut = byId.get(shortcut.id);
      if (!storedShortcut) {
        return shortcut;
      }

      return {
        ...shortcut,
        label: storedShortcut.label?.trim() || shortcut.label,
        enabled: Boolean(storedShortcut.enabled),
      };
    });
  } catch {
    return defaultShortcuts;
  }
}

function useEditableShortcuts(defaultShortcuts: AppShortcut[]) {
  const [shortcuts, setShortcuts] = useState<AppShortcut[]>(() =>
    readStoredShortcuts(defaultShortcuts),
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setShortcuts(readStoredShortcuts(defaultShortcuts));
  }, [defaultShortcuts]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedShortcuts = shortcuts.map(({ id, label, enabled }) => ({
      id,
      label,
      enabled,
    }));
    window.localStorage.setItem(
      SHORTCUTS_STORAGE_KEY,
      JSON.stringify(storedShortcuts),
    );
  }, [shortcuts]);

  const onLabelChange = (shortcutId: string, nextLabel: string) => {
    setShortcuts((current) =>
      current.map((shortcut) =>
        shortcut.id === shortcutId
          ? { ...shortcut, label: nextLabel }
          : shortcut,
      ),
    );
  };

  const onEnabledChange = (shortcutId: string, enabled: boolean) => {
    setShortcuts((current) =>
      current.map((shortcut) =>
        shortcut.id === shortcutId ? { ...shortcut, enabled } : shortcut,
      ),
    );
  };

  return {
    shortcuts,
    isEditing,
    setIsEditing,
    onLabelChange,
    onEnabledChange,
  };
}

function useRole() {
  const [groups, setGroups] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const response = await fetch("/api/me/role", { cache: "no-store" });
        const data = (await response.json()) as { groups?: string[] };
        setGroups(Array.isArray(data.groups) ? data.groups : []);
      } catch {
        setGroups([]);
      } finally {
        setLoaded(true);
      }
    };

    void loadRole();
  }, []);

  return {
    loaded,
    canConfigureAdvising:
      groups.includes("advising-admin") || groups.includes("advising-advisor"),
  };
}

function useOverlayEscape(
  isShortcutsOpen: boolean,
  setIsShortcutsOpen: (value: boolean) => void,
  isProfileOpen: boolean,
  setIsProfileOpen: (value: boolean) => void,
) {
  useEffect(() => {
    if (!isShortcutsOpen && !isProfileOpen) {
      document.body.style.overflow = "";
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsShortcutsOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isShortcutsOpen, isProfileOpen, setIsShortcutsOpen, setIsProfileOpen]);
}

export default function Navbar() {
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { loaded, canConfigureAdvising } = useRole();

  const defaultShortcuts = useMemo(
    () => getDefaultShortcuts(canConfigureAdvising),
    [canConfigureAdvising],
  );

  const {
    shortcuts,
    isEditing,
    setIsEditing,
    onLabelChange,
    onEnabledChange,
  } = useEditableShortcuts(defaultShortcuts);

  useOverlayEscape(
    isShortcutsOpen,
    setIsShortcutsOpen,
    isProfileOpen,
    setIsProfileOpen,
  );

  return (
    <>
      <nav className="flex h-[3.3125rem] items-center justify-between py-[0.8125rem]">
        <div className="flex items-center gap-[1.1875rem]">
          <button type="button" className="text-white hover:text-white/80">
            <Image src="/images/menu-icon.svg" alt="Menu" width={17} height={14} />
          </button>
          <div className="flex items-center gap-[1.3125rem]">
            <Image
              src="/images/gt-logo.svg"
              alt="Georgia Tech"
              width={60}
              height={37}
            />
            <div className="h-[2.8125rem] w-0 border-l border-white/40" />
            <span className="font-[family-name:'Roboto_Slab',serif] text-[2.5rem] leading-normal text-white">
              BuzzPort
            </span>
          </div>
        </div>
        <NavQuickActions
          onAppsClick={() => setIsShortcutsOpen(true)}
          onProfileClick={() => setIsProfileOpen(true)}
        />
      </nav>
      <ShortcutsOverlay
        isOpen={isShortcutsOpen}
        onClose={() => {
          setIsShortcutsOpen(false);
          setIsEditing(false);
        }}
        shortcuts={loaded ? shortcuts : defaultShortcuts}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing((current) => !current)}
        onLabelChange={onLabelChange}
        onEnabledChange={onEnabledChange}
      />
      <ProfileOverlay
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}

export function SmallNav() {
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { loaded, canConfigureAdvising } = useRole();

  const defaultShortcuts = useMemo(
    () => getDefaultShortcuts(canConfigureAdvising),
    [canConfigureAdvising],
  );

  const {
    shortcuts,
    isEditing,
    setIsEditing,
    onLabelChange,
    onEnabledChange,
  } = useEditableShortcuts(defaultShortcuts);

  useOverlayEscape(
    isShortcutsOpen,
    setIsShortcutsOpen,
    isProfileOpen,
    setIsProfileOpen,
  );

  return (
    <>
      <nav className="flex h-[2.8125rem] items-center justify-between bg-gt-gold px-[1.0625rem] py-[1rem]">
        <div className="flex items-center gap-[1.6875rem]">
          <button type="button" className="text-white hover:text-white/80">
            <Image src="/images/menu-icon.svg" alt="Menu" width={17} height={14} />
          </button>
          <span className="font-[family-name:Arial,sans-serif] text-[1rem] leading-normal text-white">
            Home
          </span>
        </div>
        <NavQuickActions
          onAppsClick={() => setIsShortcutsOpen(true)}
          onProfileClick={() => setIsProfileOpen(true)}
        />
      </nav>
      <ShortcutsOverlay
        isOpen={isShortcutsOpen}
        onClose={() => {
          setIsShortcutsOpen(false);
          setIsEditing(false);
        }}
        shortcuts={loaded ? shortcuts : defaultShortcuts}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing((current) => !current)}
        onLabelChange={onLabelChange}
        onEnabledChange={onEnabledChange}
      />
      <ProfileOverlay
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
