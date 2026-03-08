'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { SmallNav } from '@/components/layout/Navbar';
import FormHeader from '@/components/ui/FormHeader';
import NavigationSubmenu from '@/components/ui/NavigationSubmenu';
import {
    TableHeader,
    TableRow,
    TablePaginationBar,
} from '@/components/ui/Table';
import { quaidApiRequest } from '@/lib/quaid-api-client';
import { useRole } from '@/lib/useRole';
import type {
    AdvisingSlot,
    AdvisingSlotsResponse,
} from '@/lib/quaid-api-types';
import type { TableColumn, TableRowData } from '@/lib/table-types';

const attendeeColumns: TableColumn[] = [
    { key: 'name', label: 'Name', width: '10rem', sortable: true },
    { key: 'email', label: 'Email', width: '14rem' },
    { key: 'program', label: 'Program of Study', width: '10rem' },
    { key: 'actions', label: '', width: '3rem' },
];

function DetailField({
    label,
    value,
}: Readonly<{ label: string; value: string }>) {
    return (
        <div className="flex flex-col gap-1">
            <span className="font-[Arial,sans-serif] text-[0.625rem] font-bold text-[#6b7280]">
                {label}
            </span>
            <span className="font-[Arial,sans-serif] text-[0.8125rem] text-black">
                {value}
            </span>
        </div>
    );
}

function StatusBadge({ status }: Readonly<{ status: string }>) {
    const isScheduled = status === 'BOOKED' || status === 'SCHEDULED';
    return (
        <div
            className={`inline-flex items-center justify-center w-fit rounded-[0.25rem] border-[1.5px] px-[0.5rem] py-[0.125rem] ${
                isScheduled
                    ? 'border-[#16a34a] text-[#16a34a]'
                    : 'border-[#6b7280] text-[#6b7280]'
            }`}
        >
            <span className="font-[Arial,sans-serif] text-[0.625rem] font-bold">
                {isScheduled ? 'SCHEDULED' : status}
            </span>
        </div>
    );
}

export default function MeetingDetailPage() {
    const params = useParams();
    const meetingId = params.meetingId as string;
    const [meeting, setMeeting] = useState<AdvisingSlot | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'attendees' | 'resolution'>(
        'attendees'
    );
    const { name: userName, email: userEmail } = useRole();

    const loadMeeting = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response =
                await quaidApiRequest<AdvisingSlotsResponse>(
                    'advising/bookings'
                );
            const found = response.data.find(
                (slot) => slot.slotId === meetingId
            );
            if (found) {
                setMeeting(found);
            } else {
                setError('Meeting not found');
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to load meeting details'
            );
        } finally {
            setLoading(false);
        }
    }, [meetingId]);

    useEffect(() => {
        void loadMeeting();
    }, [loadMeeting]);

    const submenuItems = [
        {
            label: 'Upcoming Advising Meetings',
            href: '/advising-meetings',
            active: true,
        },
        {
            label: 'Past Advising Meetings',
            href: '/advising-meetings',
            active: false,
        },
    ];

    const dt = meeting ? new Date(meeting.slotDateTime) : null;

    const attendeeRow: TableRowData = meeting
        ? {
              id: String(meeting.studentId ?? 'unknown'),
              name: userName ?? '—',
              email: userEmail ?? '—',
              program: 'Computer Science',
          }
        : { id: 'none', name: '', email: '', program: '' };

    return (
        <div className="flex min-h-screen w-full flex-col bg-white">
            <SmallNav />
            <FormHeader title="Advising Meetings" />
            <div className="flex flex-1 items-stretch">
                <NavigationSubmenu items={submenuItems} />
                <div className="flex flex-1 flex-col px-6 py-4">
                    <div className="mb-4 flex items-center gap-2">
                        <Link
                            href="/advising-meetings"
                            className="flex items-center justify-center"
                        >
                            <Image
                                src="/images/arrow-back.svg"
                                alt="Back"
                                width={16}
                                height={16}
                            />
                        </Link>
                        <h1 className="font-[Arial,sans-serif] text-[1rem] font-bold text-black">
                            Appointment Details
                        </h1>
                    </div>

                    {error && (
                        <p className="mb-2 font-[Arial,sans-serif] text-sm text-alert-red">
                            {error}
                        </p>
                    )}

                    {loading ? (
                        <p className="font-[Arial,sans-serif] text-[0.875rem] text-[#4b5563]">
                            Loading meeting details...
                        </p>
                    ) : meeting ? (
                        <div className="flex gap-6">
                            {/* Left panel - Details */}
                            <div className="flex w-88 flex-col gap-4 rounded-sm bg-white p-5 shadow-[0_0_0.5rem_rgba(0,0,0,0.1)]">
                                <h2 className="font-[Arial,sans-serif] text-[0.875rem] font-bold text-black">
                                    Details
                                </h2>
                                <div className="flex flex-col gap-3">
                                    <DetailField
                                        label="Date"
                                        value={dt?.toLocaleDateString() ?? ''}
                                    />
                                    <DetailField
                                        label="Time"
                                        value={
                                            dt?.toLocaleTimeString([], {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                            }) ?? ''
                                        }
                                    />
                                    <DetailField
                                        label="Appointment Type"
                                        value="Virtual (Zoom)"
                                    />
                                    <DetailField
                                        label="Location"
                                        value="Online"
                                    />
                                    <DetailField
                                        label="Instructions"
                                        value="Join via Zoom link sent to your email"
                                    />
                                    <DetailField
                                        label="Attendee"
                                        value={userName ?? '—'}
                                    />
                                    <DetailField
                                        label="Notes"
                                        value={
                                            meeting.bookingDescription ?? '—'
                                        }
                                    />
                                    <div className="flex flex-col gap-1">
                                        <span className="font-[Arial,sans-serif] text-[0.625rem] font-bold text-[#6b7280]">
                                            Outcome
                                        </span>
                                        <StatusBadge status={meeting.status} />
                                    </div>
                                </div>
                            </div>

                            {/* Right panel - Attendees / Resolution */}
                            <div className="flex flex-1 flex-col rounded-sm bg-white shadow-[0_0_0.5rem_rgba(0,0,0,0.1)]">
                                <div className="flex border-b border-[#d1d5db]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveTab('attendees')
                                        }
                                        className={`px-[1.25rem] py-[0.75rem] font-[family-name:Arial,sans-serif] text-[0.8125rem] font-bold ${
                                            activeTab === 'attendees'
                                                ? 'border-b-2 border-link-blue text-link-blue'
                                                : 'text-[#6b7280]'
                                        }`}
                                    >
                                        Attendees
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveTab('resolution')
                                        }
                                        className={`px-[1.25rem] py-[0.75rem] font-[family-name:Arial,sans-serif] text-[0.8125rem] font-bold ${
                                            activeTab === 'resolution'
                                                ? 'border-b-2 border-link-blue text-link-blue'
                                                : 'text-[#6b7280]'
                                        }`}
                                    >
                                        Resolution
                                    </button>
                                </div>

                                <div className="p-4">
                                    {activeTab === 'attendees' ? (
                                        <div className="flex flex-col">
                                            <h3 className="mb-2 font-[Arial,sans-serif] text-[0.8125rem] font-bold text-black">
                                                Appointment Attendees
                                            </h3>
                                            <TableHeader
                                                columns={attendeeColumns}
                                                showCheckbox={false}
                                            />
                                            <TableRow
                                                row={attendeeRow}
                                                columns={attendeeColumns}
                                                showCheckbox={false}
                                            />
                                            <TablePaginationBar
                                                pagination={{
                                                    currentPage: 1,
                                                    totalPages: 1,
                                                    perPage: 10,
                                                    totalResults: 1,
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <p className="font-[Arial,sans-serif] text-[0.8125rem] text-[#4b5563]">
                                            No resolution notes yet.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
