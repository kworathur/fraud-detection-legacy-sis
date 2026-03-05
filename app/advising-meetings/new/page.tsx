"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SmallNav } from "@/components/layout/Navbar";
import FormHeader from "@/components/ui/FormHeader";
import FormSteps from "@/components/ui/FormSteps";
import type { FormStep } from "@/components/ui/FormSteps";
import { quaidApiRequest } from "@/lib/quaid-api-client";
import type {
  AdvisingAdvisorResponse,
  AdvisingSlot,
  AdvisingSlotsResponse,
} from "@/lib/quaid-api-types";

const steps: FormStep[] = [
  { label: "Advising Meeting Scheduling Form", icon: "edit", active: true },
  { label: "Review and Submit", icon: "clipboard" },
];

function DisabledField({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex w-56.25 flex-col items-start gap-2">
      <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
        {label}
      </label>
      <div className="flex h-7 w-full items-center bg-[#f3f4f6] px-2.5">
        <span className="font-[Arial,sans-serif] text-[0.75rem] text-[#4b5563]">
          {value}
        </span>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
}>) {
  return (
    <div className="flex w-56.25 flex-col gap-2">
      <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-7 w-full border border-[#d1d5db] bg-white px-2.5 py-1.5 font-[Arial,sans-serif] text-[0.75rem] text-black"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}>) {
  return (
    <div className="flex w-56.25 flex-col gap-2">
      <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
        {label}
      </label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-7 w-full border border-[#d1d5db] bg-white px-2.5 py-1.5 font-[Arial,sans-serif] text-[0.75rem] text-black"
      />
    </div>
  );
}

export default function NewMeetingPage() {
  const router = useRouter();
  const [advisorId, setAdvisorId] = useState("");
  const [advisorName, setAdvisorName] = useState("");
  const [availability, setAvailability] = useState<AdvisingSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [bookingDescription, setBookingDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const availableSlots = useMemo(
    () => availability.filter((slot) => slot.status === "AVAILABLE"),
    [availability],
  );

  const dateOptions = useMemo(() => {
    const uniqueDates = Array.from(
      new Set(availableSlots.map((slot) => slot.slotDateTime.slice(0, 10))),
    );

    return uniqueDates.map((date) => ({
      value: date,
      label: new Date(`${date}T00:00:00`).toLocaleDateString(),
    }));
  }, [availableSlots]);

  const slotOptions = useMemo(() => {
    if (!selectedDate) {
      return [] as Array<{ value: string; label: string }>;
    }

    return availableSlots
      .filter((slot) => slot.slotDateTime.slice(0, 10) === selectedDate)
      .map((slot) => ({
        value: slot.slotId,
        label: new Date(slot.slotDateTime).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      }));
  }, [availableSlots, selectedDate]);

  const loadAdvisorAndAvailability = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const advisor = await quaidApiRequest<AdvisingAdvisorResponse>(
        "advising/advisor",
      );
      setAdvisorId(advisor.advisorId);
      setAdvisorName(advisor.advisorName?.trim() || advisor.advisorId);

      const availabilityResponse = await quaidApiRequest<AdvisingSlotsResponse>(
        `advising/availability/advisor/${advisor.advisorId}`,
      );
      setAvailability(availabilityResponse.data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load advising data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAdvisorAndAvailability();
  }, [loadAdvisorAndAvailability]);

  useEffect(() => {
    if (
      selectedSlotId &&
      !slotOptions.some((slot) => slot.value === selectedSlotId)
    ) {
      setSelectedSlotId("");
    }
  }, [selectedSlotId, slotOptions]);

  const bookSlot = async () => {
    if (!selectedSlotId) {
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await quaidApiRequest("advising/bookings", {
        method: "POST",
        body: JSON.stringify({
          slotId: selectedSlotId,
          ...(bookingDescription ? { bookingDescription } : {}),
        }),
      });

      setMessage("Advising meeting booked successfully.");
      router.push(`/advising-meetings/${selectedSlotId}`);
    } catch (bookError) {
      setError(
        bookError instanceof Error
          ? bookError.message
          : "Failed to create booking",
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <SmallNav />
      <FormHeader title="Advising Meeting Scheduling Form" />
      <div className="flex flex-1 items-stretch">
        <FormSteps steps={steps} />
        <div className="flex flex-1 flex-col items-center px-13.5 py-2.5">
          <div className="flex w-171.5 flex-col gap-3.25">
            <div className="flex flex-col">
              <div className="h-18.5 w-full bg-gt-gold" />
              <div className="flex h-9.75 items-center justify-center bg-[#4ec8ff] p-2.5">
                <span className="font-[Arial,sans-serif] text-[1.5rem] text-black">
                  Advising Meeting Scheduling Form
                </span>
              </div>
              <div className="flex h-36.25 items-center py-2.5">
                <p className="font-[Arial,sans-serif] text-[1.25rem] leading-normal text-black">
                  Use this form to schedule a virtual zoom meeting with your
                  advisor
                  {advisorName
                    ? `, ${advisorName}`
                    : advisorId
                      ? `, ${advisorId}`
                      : ""}
                  . Select the topic you wish to discuss during your meeting, so
                  that we can match you with another advisor if your assigned
                  advisor is unavailable.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-4">
              <DisabledField label="* Your Student ID" value="From session" />
              <DisabledField label="* Your Name" value="From session" />
              <DisabledField label="* Email Address" value="From session" />
              <SelectField
                label="* Date"
                value={selectedDate}
                onChange={setSelectedDate}
                options={dateOptions}
                placeholder="-- Select Date --"
              />
              <SelectField
                label="* Meeting Time"
                value={selectedSlotId}
                onChange={setSelectedSlotId}
                options={slotOptions}
                placeholder="-- Select Time --"
              />
              <TextField
                label="* What Would You Like to Discuss?"
                value={bookingDescription}
                onChange={setBookingDescription}
                placeholder="Enter Additional Details Here"
              />
              <button
                type="button"
                onClick={bookSlot}
                disabled={!selectedSlotId || loading}
                className="w-fit rounded bg-link-blue px-4 py-2 font-[Arial,sans-serif] text-[0.75rem] font-bold text-white disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Book Meeting"}
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-2 font-[Arial,sans-serif] text-sm text-alert-red">
              {error}
            </p>
          )}

          {message && (
            <p className="mt-2 text-sm text-[#166534]">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
