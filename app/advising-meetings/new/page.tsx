'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SmallNav } from '@/components/layout/Navbar';
import FormHeader from '@/components/ui/FormHeader';
import FormSteps from '@/components/ui/FormSteps';
import type { FormStep } from '@/components/ui/FormSteps';
import Dropdown from '@/components/ui/Dropdown';
import { quaidApiRequest } from '@/lib/quaid-api-client';
import type {
    AdvisingAdvisorResponse,
    AdvisingSlot,
    AdvisingSlotsResponse,
} from '@/lib/quaid-api-types';

const steps: FormStep[] = [
    { label: 'Advising Meeting Scheduling Form', icon: 'edit', active: true },
    { label: 'Review and Submit', icon: 'clipboard' },
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

function DatePickerField({
    label,
    value,
    onChange,
    availableDates,
}: Readonly<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    availableDates: Set<string>;
}>) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewMonth, setViewMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const daysInMonth = new Date(
        viewMonth.getFullYear(),
        viewMonth.getMonth() + 1,
        0
    ).getDate();
    // Monday-first: convert JS getDay() (0=Sun) to Mon=0..Sun=6
    const firstDayRaw = new Date(
        viewMonth.getFullYear(),
        viewMonth.getMonth(),
        1
    ).getDay();
    const firstDayOfWeek = (firstDayRaw + 6) % 7;

    const days: (number | null)[] = [
        ...Array.from<null>({ length: firstDayOfWeek }).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    function toDateStr(day: number): string {
        const y = viewMonth.getFullYear();
        const m = (viewMonth.getMonth() + 1).toString().padStart(2, '0');
        const d = day.toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    const monthName = viewMonth.toLocaleDateString('en-US', { month: 'long' });
    const yearLabel = viewMonth.getFullYear().toString();

    const displayValue = value
        ? new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
          })
        : '';

    return (
        <div ref={ref} className="relative flex w-56.25 flex-col gap-2">
            <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                {label}
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex h-7 w-full items-center border border-[#d1d5db] bg-white pr-7 pl-2.5 font-[Arial,sans-serif] text-[0.75rem] text-black"
            >
                <span
                    className={displayValue ? 'text-black' : 'text-[#9ca3af]'}
                >
                    {displayValue || '-- Select Date --'}
                </span>
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-600">
                    <Image
                        src="/images/chevron-down.svg"
                        alt=""
                        width={10}
                        height={6}
                    />
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 z-10 mt-1 rounded-[6px] border border-[#d1d5db] bg-white p-3 shadow-lg">
                    {/* Header: prev / month year / next */}
                    <div className="mb-3 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() =>
                                setViewMonth(
                                    new Date(
                                        viewMonth.getFullYear(),
                                        viewMonth.getMonth() - 1,
                                        1
                                    )
                                )
                            }
                            className="flex h-[44px] w-[44px] items-center justify-center rounded-[80px] bg-white shadow-[0px_1px_1px_0px_rgba(0,14,51,0.05)] hover:bg-[#f3f4f6]"
                        >
                            <span className="font-[Arial,sans-serif] text-[1.125rem] font-bold text-[#141414]">
                                &lt;
                            </span>
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="rounded-[6px] bg-white px-3 py-1 font-[Arial,sans-serif] text-[1.5rem] font-bold text-[#141414] shadow-[0px_1px_1px_0px_rgba(0,14,51,0.05)]">
                                {monthName}
                            </span>
                            <span className="rounded-[6px] bg-white px-3 py-1 font-[Arial,sans-serif] text-[1.5rem] font-bold text-[#141414] shadow-[0px_1px_1px_0px_rgba(0,14,51,0.05)]">
                                {yearLabel}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                setViewMonth(
                                    new Date(
                                        viewMonth.getFullYear(),
                                        viewMonth.getMonth() + 1,
                                        1
                                    )
                                )
                            }
                            className="flex h-[44px] w-[44px] items-center justify-center rounded-[80px] bg-white shadow-[0px_1px_1px_0px_rgba(0,14,51,0.05)] hover:bg-[#f3f4f6]"
                        >
                            <span className="font-[Arial,sans-serif] text-[1.125rem] font-bold text-[#141414]">
                                &gt;
                            </span>
                        </button>
                    </div>

                    {/* Day-of-week headers */}
                    <div className="mb-3 grid grid-cols-7 text-center">
                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                            <div
                                key={d}
                                className="flex h-[44px] w-[54px] items-center justify-center font-[Arial,sans-serif] text-[1.125rem] text-[#1f1f1f]"
                            >
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Day grid */}
                    <div className="grid grid-cols-7 gap-y-1 text-center">
                        {days.map((day, i) => {
                            if (day === null) {
                                return (
                                    <div
                                        key={`empty-${i}`}
                                        className="h-[44px] w-[54px]"
                                    />
                                );
                            }
                            const dateStr = toDateStr(day);
                            const isAvailable = availableDates.has(dateStr);
                            const isSelected = dateStr === value;
                            return (
                                <button
                                    key={dateStr}
                                    type="button"
                                    disabled={!isAvailable}
                                    onClick={() => {
                                        onChange(dateStr);
                                        setIsOpen(false);
                                    }}
                                    className={`flex h-[44px] w-[54px] items-center justify-center rounded-[6px] font-[Lexend,Arial,sans-serif] text-[1.125rem] font-medium ${
                                        isSelected
                                            ? 'bg-[#0284c7] text-white shadow-[0px_1px_1px_0px_rgba(0,14,51,0.05)]'
                                            : isAvailable
                                              ? 'bg-white text-[#1f1f1f] shadow-[0px_1px_1px_0px_rgba(0,14,51,0.05)] hover:bg-[#f0f9ff]'
                                              : 'cursor-not-allowed text-[rgba(0,23,84,0.15)]'
                                    }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
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

type StudentProfile = {
    sub: string | null;
    name: string | null;
    email: string | null;
};

export default function NewMeetingPage() {
    const router = useRouter();
    const [student, setStudent] = useState<StudentProfile>({
        sub: null,
        name: null,
        email: null,
    });
    const [advisorId, setAdvisorId] = useState('');
    const [advisorName, setAdvisorName] = useState('');
    const [availability, setAvailability] = useState<AdvisingSlot[]>([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlotId, setSelectedSlotId] = useState('');
    const [bookingDescription, setBookingDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const availableSlots = useMemo(
        () => availability.filter((slot) => slot.status === 'AVAILABLE'),
        [availability]
    );

    const availableDates = useMemo(() => {
        const dates = new Set<string>();
        for (const slot of availableSlots) {
            dates.add(slot.slotDateTime.slice(0, 10));
        }
        return dates;
    }, [availableSlots]);

    const slotOptions = useMemo(() => {
        if (!selectedDate) {
            return [] as Array<{ value: string; label: string }>;
        }

        return availableSlots
            .filter((slot) => slot.slotDateTime.slice(0, 10) === selectedDate)
            .sort(
                (a, b) =>
                    new Date(a.slotDateTime).getTime() -
                    new Date(b.slotDateTime).getTime()
            )
            .map((slot) => ({
                value: slot.slotId,
                label: new Date(slot.slotDateTime).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                }),
            }));
    }, [availableSlots, selectedDate]);

    const loadAdvisorAndAvailability = useCallback(async () => {
        setLoading(true);
        setError('');
        setMessage('');

        try {
            // Fetch student profile
            const meResponse = await fetch('/api/me/role', {
                cache: 'no-store',
            });
            const me = (await meResponse.json()) as StudentProfile;
            setStudent(me);

            const advisor =
                await quaidApiRequest<AdvisingAdvisorResponse>(
                    'advising/advisor'
                );
            setAdvisorId(advisor.advisorId);
            setAdvisorName(advisor.advisorName?.trim() || advisor.advisorId);

            const availabilityResponse =
                await quaidApiRequest<AdvisingSlotsResponse>(
                    `advising/availability/advisor/${advisor.advisorId}`
                );
            setAvailability(availabilityResponse.data);
        } catch (loadError) {
            setError(
                loadError instanceof Error
                    ? loadError.message
                    : 'Failed to load advising data'
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
            setSelectedSlotId('');
        }
    }, [selectedSlotId, slotOptions]);

    const bookSlot = async () => {
        if (!selectedSlotId) {
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            await quaidApiRequest('advising/bookings', {
                method: 'POST',
                body: JSON.stringify({
                    slotId: selectedSlotId,
                    ...(bookingDescription ? { bookingDescription } : {}),
                }),
            });

            setMessage('Advising meeting booked successfully.');
            router.push(`/advising-meetings/${selectedSlotId}`);
        } catch (bookError) {
            setError(
                bookError instanceof Error
                    ? bookError.message
                    : 'Failed to create booking'
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
                                    Use this form to schedule a virtual zoom
                                    meeting with your advisor
                                    {advisorName ? `, ${advisorName}` : ''}.
                                    Select a date and time from the dropdowns
                                    below to book a meeting.
                                </p>
                            </div>
                        </div>

                        <div className="flex w-full flex-col gap-4">
                            <DisabledField
                                label="* Your Student ID"
                                value={student.sub ?? '—'}
                            />
                            <DisabledField
                                label="* Your Name"
                                value={student.name ?? '—'}
                            />
                            <DisabledField
                                label="* Email Address"
                                value={student.email ?? '—'}
                            />
                            <DatePickerField
                                label="* Date"
                                value={selectedDate}
                                onChange={(date) => {
                                    setSelectedDate(date);
                                    setSelectedSlotId('');
                                }}
                                availableDates={availableDates}
                            />
                            <div className="flex w-56.25 flex-col gap-2">
                                <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                                    * Meeting Time
                                </label>
                                <Dropdown
                                    value={selectedSlotId}
                                    onChange={setSelectedSlotId}
                                    options={slotOptions}
                                    placeholder={
                                        selectedDate
                                            ? slotOptions.length > 0
                                                ? '-- Select Time --'
                                                : 'No times available'
                                            : 'Select a date first'
                                    }
                                    disabled={
                                        !selectedDate ||
                                        slotOptions.length === 0
                                    }
                                />
                            </div>
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
                                {loading ? 'Submitting...' : 'Book Meeting'}
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
