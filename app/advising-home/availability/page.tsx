"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { quaidApiRequest } from "@/lib/quaid-api-client";
import type { AdvisingSlotsResponse } from "@/lib/quaid-api-types";

const SLOT_START_HOUR = 9;
const SLOT_END_HOUR = 17;
const SLOT_INTERVAL_MINUTES = 30;

function getNextMonday(): Date {
  const now = new Date();
  const day = now.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + daysUntilMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getWeekDays(monday: Date): Date[] {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = SLOT_START_HOUR; h < SLOT_END_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_INTERVAL_MINUTES) {
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const ampm = h >= 12 ? "PM" : "AM";
      const mm = m.toString().padStart(2, "0");
      slots.push(`${hour12}:${mm} ${ampm}`);
    }
  }
  return slots;
}

function toISOSlotDateTime(day: Date, timeLabel: string): string {
  const [timePart, ampm] = timeLabel.split(" ");
  const [hourStr, minStr] = timePart.split(":");
  let hour = parseInt(hourStr, 10);
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  const d = new Date(day);
  d.setHours(hour, parseInt(minStr, 10), 0, 0);
  return d.toISOString();
}

function formatDayHeader(day: Date): string {
  return day.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatDateParam(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const TIME_SLOTS = generateTimeSlots();

type SlotKey = string; // "dayIndex-slotIndex"

function slotKey(dayIndex: number, slotIndex: number): SlotKey {
  return `${dayIndex}-${slotIndex}`;
}

export default function AvailabilityPage() {
  const advisorIdRef = useRef("");
  const [selectedSlots, setSelectedSlots] = useState<Set<SlotKey>>(new Set());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const monday = getNextMonday();
  const weekDays = getWeekDays(monday);

  // Drag state
  const isDragging = useRef(false);
  const dragMode = useRef<"select" | "deselect">("select");
  const dragStartSlot = useRef<SlotKey | null>(null);

  const loadExistingSlots = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const meResponse = await fetch("/api/me/role", { cache: "no-store" });
      const me = (await meResponse.json()) as { sub: string | null };
      if (!me.sub) throw new Error("Unable to determine advisor identity");
      advisorIdRef.current = me.sub;

      const response = await quaidApiRequest<AdvisingSlotsResponse>(
        `advising/availability/advisor/${me.sub}`,
      );

      const existing = new Set<SlotKey>();
      for (const slot of response.data) {
        if (slot.status === "CANCELLED") continue;
        const slotDate = new Date(slot.slotDateTime);
        const dayIndex = weekDays.findIndex(
          (d) =>
            d.getFullYear() === slotDate.getFullYear() &&
            d.getMonth() === slotDate.getMonth() &&
            d.getDate() === slotDate.getDate(),
        );
        if (dayIndex === -1) continue;

        const hour = slotDate.getHours();
        const minute = slotDate.getMinutes();
        const totalMinutes =
          (hour - SLOT_START_HOUR) * 60 + minute;
        const slotIndex = Math.floor(totalMinutes / SLOT_INTERVAL_MINUTES);
        if (slotIndex >= 0 && slotIndex < TIME_SLOTS.length) {
          existing.add(slotKey(dayIndex, slotIndex));
        }
      }
      setSelectedSlots(existing);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load availability",
      );
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void loadExistingSlots();
  }, [loadExistingSlots]);

  function handleMouseDown(key: SlotKey) {
    isDragging.current = true;
    dragStartSlot.current = key;
    const isSelected = selectedSlots.has(key);
    dragMode.current = isSelected ? "deselect" : "select";
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      if (isSelected) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function handleMouseEnter(key: SlotKey) {
    if (!isDragging.current) return;
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      if (dragMode.current === "select") {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
  }

  function handleMouseUp() {
    isDragging.current = false;
    dragStartSlot.current = null;
  }

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const slots: { slotDateTime: string }[] = [];
      for (const key of selectedSlots) {
        const [dayStr, slotStr] = key.split("-");
        const dayIndex = parseInt(dayStr, 10);
        const slotIndex = parseInt(slotStr, 10);
        slots.push({
          slotDateTime: toISOSlotDateTime(weekDays[dayIndex], TIME_SLOTS[slotIndex]),
        });
      }

      await quaidApiRequest(
        `advising/availability/week/${formatDateParam(monday)}`,
        {
          method: "PUT",
          body: JSON.stringify({ slots }),
        },
      );
      setSuccess("Availability saved successfully.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save availability",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto p-2">
      <div className="flex flex-col gap-2.5 rounded-sm bg-white p-2.5 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
            <h2 className="font-[Arial,sans-serif] text-[0.875rem] font-bold text-black">
              Availability for Future Meetings
            </h2>
            <p className="font-[Arial,sans-serif] text-[0.75rem] text-[#404040]">
              Indicate your availability for future advising meetings with
              students by sliding your mouse over the times that work while
              holding down.
            </p>

            {error && (
              <p className="font-[Arial,sans-serif] text-[0.75rem] text-alert-red">
                {error}
              </p>
            )}
            {success && (
              <p className="font-[Arial,sans-serif] text-[0.75rem] text-[#166534]">
                {success}
              </p>
            )}

            {loading ? (
              <p className="py-4 text-center font-[Arial,sans-serif] text-[0.75rem] text-[#404040]">
                Loading...
              </p>
            ) : (
              <>
                <div
                  className="flex select-none gap-2"
                  onMouseLeave={handleMouseUp}
                >
                  {weekDays.map((day, dayIndex) => (
                    <div key={dayIndex} className="flex flex-1 flex-col">
                      <div className="flex h-6 items-center justify-center px-2.5 py-1">
                        <span className="whitespace-nowrap font-[Arial,sans-serif] text-[0.875rem] font-bold text-black">
                          {formatDayHeader(day)}
                        </span>
                      </div>
                      {TIME_SLOTS.map((time, slotIndex) => {
                        const key = slotKey(dayIndex, slotIndex);
                        const isSelected = selectedSlots.has(key);
                        return (
                          <div
                            key={key}
                            className="flex items-start gap-4"
                          >
                            <span className="w-16 shrink-0 font-[Arial,sans-serif] text-[0.875rem] font-bold text-black">
                              {time}
                            </span>
                            <div
                              className={`h-13 w-full cursor-pointer border border-[#e5e5e5] ${
                                isSelected
                                  ? "bg-[#166534]"
                                  : "bg-transparent"
                              }`}
                              onMouseDown={() => handleMouseDown(key)}
                              onMouseEnter={() => handleMouseEnter(key)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => void handleSave()}
                    disabled={saving}
                  >
                    {saving ? "SAVING..." : "SAVE AVAILABILITY"}
                  </Button>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border border-[#e5e5e5] bg-[#166534]" />
                    <span className="font-[Arial,sans-serif] text-[0.75rem] text-[#404040]">
                      Available
                    </span>
                    <div className="ml-2 h-4 w-4 border border-[#e5e5e5] bg-transparent" />
                    <span className="font-[Arial,sans-serif] text-[0.75rem] text-[#404040]">
                      Unavailable
                    </span>
                  </div>
                </div>
              </>
            )}
      </div>
    </div>
  );
}
