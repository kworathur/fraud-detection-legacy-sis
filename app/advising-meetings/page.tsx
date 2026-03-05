"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SmallNav } from "@/components/layout/Navbar";
import FormHeader from "@/components/ui/FormHeader";
import NavigationSubmenu from "@/components/ui/NavigationSubmenu";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import { quaidApiRequest } from "@/lib/quaid-api-client";
import type { AdvisingSlot, AdvisingSlotsResponse } from "@/lib/quaid-api-types";
import type { TableColumn, TableRowData } from "@/lib/table-types";

const columns: TableColumn[] = [
  { key: "date", label: "Date", width: "8rem", sortable: true },
  { key: "time", label: "Time", width: "6rem" },
  { key: "advisor", label: "Advisor", width: "8rem" },
  { key: "topic", label: "Topic", width: "12rem" },
  { key: "status", label: "Status", width: "6rem" },
  { key: "actions", label: "", width: "3rem" },
];

function slotToRow(slot: AdvisingSlot): TableRowData {
  const dt = new Date(slot.slotDateTime);
  return {
    id: slot.slotId,
    date: dt.toLocaleDateString(),
    time: dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    advisor: slot.advisorDisplayName ?? slot.advisorId,
    topic: slot.bookingDescription ?? "",
    status: slot.status === "BOOKED" ? "pending" : "draft",
  };
}

export default function AdvisingMeetingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdvisingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<"upcoming" | "past">("upcoming");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await quaidApiRequest<AdvisingSlotsResponse>(
        "advising/bookings",
      );
      setBookings(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load meetings",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const now = new Date();
  const filtered = bookings.filter((slot) => {
    const dt = new Date(slot.slotDateTime);
    return view === "upcoming" ? dt >= now : dt < now;
  });

  const rows = filtered.map(slotToRow);

  const submenuItems = [
    {
      label: "Upcoming Advising Meetings",
      href: "/advising-meetings",
      active: view === "upcoming",
    },
    {
      label: "Past Advising Meetings",
      href: "/advising-meetings",
      active: view === "past",
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <SmallNav />
      <FormHeader title="Advising Meetings" />
      <div className="flex flex-1 items-stretch">
        <NavigationSubmenu
          items={submenuItems.map((item) => ({
            ...item,
            href: "#",
          }))}
        />
        <div className="flex flex-1 flex-col px-6 py-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setView("upcoming")}
                className={`rounded px-3 py-1 font-[family-name:Arial,sans-serif] text-[0.75rem] font-bold ${
                  view === "upcoming"
                    ? "bg-link-blue text-white"
                    : "border border-[#d1d5db] text-black"
                }`}
              >
                Upcoming
              </button>
              <button
                type="button"
                onClick={() => setView("past")}
                className={`rounded px-3 py-1 font-[family-name:Arial,sans-serif] text-[0.75rem] font-bold ${
                  view === "past"
                    ? "bg-link-blue text-white"
                    : "border border-[#d1d5db] text-black"
                }`}
              >
                Past
              </button>
            </div>
            <Button href="/advising-meetings/new" variant="secondary">
              New Meeting
            </Button>
          </div>

          {error && (
            <p className="mb-2 font-[Arial,sans-serif] text-sm text-alert-red">
              {error}
            </p>
          )}

          {loading ? (
            <p className="font-[Arial,sans-serif] text-[0.875rem] text-[#4b5563]">
              Loading meetings...
            </p>
          ) : rows.length === 0 ? (
            <p className="font-[Arial,sans-serif] text-[0.875rem] text-[#4b5563]">
              No {view} meetings found.
            </p>
          ) : (
            <div
              className="w-full cursor-pointer"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                const row = target.closest("[data-meeting-id]");
                if (row) {
                  router.push(
                    `/advising-meetings/${row.getAttribute("data-meeting-id")}`,
                  );
                }
              }}
            >
              <Table
                columns={columns}
                rows={rows}
                showCheckbox={false}
                pagination={{
                  currentPage: 1,
                  totalPages: 1,
                  perPage: 10,
                  totalResults: rows.length,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
