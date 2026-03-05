"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SmallNav } from "@/components/layout/Navbar";
import FormHeader from "@/components/ui/FormHeader";
import NavigationSubmenu from "@/components/ui/NavigationSubmenu";
import { TableHeader, TableRow, TablePaginationBar } from "@/components/ui/Table";
import { quaidApiRequest } from "@/lib/quaid-api-client";
import type {
  AdvisingSlot,
  AdvisingSlotsResponse,
  StudentListResponse,
} from "@/lib/quaid-api-types";
import type { TableColumn, TableRowData, TablePagination } from "@/lib/table-types";

const SUBMENU_ITEMS = [
  {
    label: "View Upcoming Meetings",
    href: "/advising-home/meetings",
    active: true,
  },
  {
    label: "View Students you Advise",
    href: "/advising-home",
    active: false,
  },
  {
    label: "Pause/Unpause Virtual Advising",
    href: "/advising-configuration/virtual-advising",
    active: false,
  },
];

const TABLE_COLUMNS: TableColumn[] = [
  { key: "studentName", label: "Name", width: "16.8125rem" },
  { key: "email", label: "Email", width: "7.6875rem" },
  { key: "time", label: "Time", width: "6.375rem" },
  { key: "actions", label: "Actions", width: "2.5625rem" },
];

function generateDateTabs(): { label: string; date: Date }[] {
  const tabs: { label: string; date: Date }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  tabs.push({ label: "Today", date: new Date(today) });

  for (let i = 1; i <= 6; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
          ? "nd"
          : day === 3 || day === 23
            ? "rd"
            : "th";
    tabs.push({ label: `${month} ${day}${suffix}`, date: d });
  }

  return tabs;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function AdvisingMeetingsAdvisorPage() {
  const [slots, setSlots] = useState<AdvisingSlot[]>([]);
  const [studentMap, setStudentMap] = useState<Map<number, { name: string; email: string }>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const dateTabs = useMemo(() => generateDateTabs(), []);

  const loadSlots = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [bookingsResponse, studentsResponse] = await Promise.all([
        quaidApiRequest<AdvisingSlotsResponse>("advising/bookings"),
        quaidApiRequest<StudentListResponse>("students?offset=0&limit=200"),
      ]);

      setSlots(bookingsResponse.data);
      setStudentMap(
        new Map(
          studentsResponse.data.map((student) => [
            student.id,
            { name: student.name, email: student.email },
          ]),
        ),
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load meetings",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSlots();
  }, [loadSlots]);

  const selectedDate = dateTabs[selectedTabIndex].date;

  const filteredSlots = slots
    .filter((slot) => slot.status === "BOOKED")
    .filter((slot) => {
      const slotDate = new Date(slot.slotDateTime);
      return isSameDay(slotDate, selectedDate);
    })
    .sort(
      (a, b) =>
        new Date(a.slotDateTime).getTime() - new Date(b.slotDateTime).getTime(),
    );

  const rows: TableRowData[] = filteredSlots.map((slot) => {
    const dt = new Date(slot.slotDateTime);
    const student = slot.studentId ? studentMap.get(slot.studentId) : undefined;
    return {
      id: slot.slotId,
      studentName: student?.name ?? `Student #${slot.studentId ?? "—"}`,
      email: student?.email ?? "—",
      time: dt.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      actions: "",
    };
  });

  const pagination: TablePagination | undefined =
    rows.length > 0
      ? {
          currentPage: 1,
          totalPages: Math.max(1, Math.ceil(rows.length / 10)),
          perPage: 10,
          totalResults: rows.length,
        }
      : undefined;

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      <SmallNav />
      <FormHeader title="Advising Meetings" />

      <div className="flex flex-1 overflow-hidden">
        <NavigationSubmenu items={SUBMENU_ITEMS} />

        <div className="flex flex-1 flex-col overflow-auto p-2">
          {error && (
            <p className="mb-2 font-[Arial,sans-serif] text-[0.75rem] text-alert-red">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2 border border-[#e5e7eb] bg-white p-2">
            <h1 className="font-[Arial,sans-serif] text-[0.75rem] font-bold text-black">
              Advising Meetings in the Next Two Weeks
            </h1>
            <div className="flex flex-col gap-3 bg-white">
              {/* Date tabs */}
              <div className="flex items-center border-b border-[#e4e4e7]">
                {dateTabs.map((tab, i) => (
                  <button
                    key={tab.label}
                    type="button"
                    onClick={() => setSelectedTabIndex(i)}
                    className={`flex h-[1.25rem] items-center justify-center rounded-t-[0.25rem] px-[0.375rem] py-[0.25rem] font-[family-name:Arial,sans-serif] text-[0.5rem] whitespace-nowrap ${
                      i === selectedTabIndex
                        ? "border-l border-r border-t border-[#e4e4e7] font-bold text-[#059669]"
                        : "text-[#525252]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sub-header */}
              <div className="px-1.5">
                <h2 className="font-[Arial,sans-serif] text-[0.625rem] font-bold text-black">
                  Advising Meetings
                </h2>
              </div>

              {/* Table */}
              <div className="flex w-full flex-col gap-1">
                <TableHeader columns={TABLE_COLUMNS} />
                {loading ? (
                  <div className="flex h-12.25 items-center justify-center border-b border-[#d1d5db] px-3.5">
                    <span className="font-[Arial,sans-serif] text-[0.625rem] text-[#6b7280]">
                      Loading...
                    </span>
                  </div>
                ) : rows.length === 0 ? (
                  <div className="flex h-12.25 items-center justify-center border-b border-[#d1d5db] px-3.5">
                    <span className="font-[Arial,sans-serif] text-[0.625rem] text-[#6b7280]">
                      No meetings scheduled for this date
                    </span>
                  </div>
                ) : (
                  rows.map((row) => (
                    <TableRow
                      key={row.id}
                      row={row}
                      columns={TABLE_COLUMNS}
                    />
                  ))
                )}
                {pagination && <TablePaginationBar pagination={pagination} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
