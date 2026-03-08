'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { quaidApiRequest } from '@/lib/quaid-api-client';
import type {
    AdvisorDirectoryEntry,
    AdvisorDirectoryResponse,
} from '@/lib/quaid-api-types';
import type {
    TableColumn,
    TableRowData,
    TablePagination,
} from '@/lib/table-types';

type AdvisingRule = {
    ruleId: string;
    advisorId: string;
    conditionType: 'LAST_NAME_RANGE';
    parameters: {
        start?: string;
        end?: string;
        [key: string]: unknown;
    };
    priority: number;
    isActive: boolean;
    createdAt: string;
};

type RuleListResponse = {
    data: AdvisingRule[];
    lastKey?: string;
};

const LIST_RULES_ENDPOINT = 'advising/admin/rules?limit=100';
const LIST_ADVISORS_ENDPOINT = 'advising/admin/advisors?offset=0&limit=60';
const DELETE_RULE_ENDPOINT_PREFIX = 'advising/admin/rules';

const TABLE_COLUMNS: TableColumn[] = [
    { key: 'name', label: 'Name', width: '27.75rem' },
    { key: 'type', label: 'Type', width: '6.9375rem' },
    { key: 'advisor', label: 'Advisor', width: '6.6875rem' },
    { key: 'priority', label: 'Priority', width: '6.125rem', align: 'center' },
    { key: 'lastUpdated', label: 'Last Updated', width: '8.1875rem' },
    { key: 'actions', label: 'Actions', align: 'center' },
];

function buildRuleName(rule: AdvisingRule, advisorName: string): string {
    const range = `${rule.parameters.start ?? ''}–${rule.parameters.end ?? ''}`;
    const shortAdvisor = advisorName
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();
    return `Last_Name_${range}_${shortAdvisor}`;
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short',
    });
}

function SuccessToast({
    message,
    onDismiss,
}: Readonly<{ message: string; onDismiss: () => void }>) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 5000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex h-7 items-center gap-2.5 rounded-sm border border-[#16a34a] bg-[#dcfce7] px-2 py-1 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.2)]">
            <span className="font-[Arial,sans-serif] text-[0.75rem] font-bold text-[#16a34a]">
                {message}
            </span>
            <Image
                src="/images/check-circle.svg"
                alt=""
                width={16}
                height={16}
            />
        </div>
    );
}

export default function AdvisingConfigurationPage() {
    return (
        <Suspense>
            <AdvisingConfigurationContent />
        </Suspense>
    );
}

function AdvisingConfigurationContent() {
    const searchParams = useSearchParams();
    const [rules, setRules] = useState<AdvisingRule[]>([]);
    const [advisors, setAdvisors] = useState<AdvisorDirectoryEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);
    const [deleting, setDeleting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(
        searchParams.get('created') === '1'
            ? 'Created New Advisor-Student Assignment!'
            : ''
    );

    const loadRules = useCallback(async () => {
        const response =
            await quaidApiRequest<RuleListResponse>(LIST_RULES_ENDPOINT);
        setRules(response.data);
    }, []);

    const loadAdvisors = useCallback(async () => {
        const response = await quaidApiRequest<AdvisorDirectoryResponse>(
            LIST_ADVISORS_ENDPOINT
        );
        setAdvisors(response.data);
    }, []);

    const loadPageData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            await Promise.all([loadRules(), loadAdvisors()]);
        } catch (loadError) {
            setError(
                loadError instanceof Error
                    ? loadError.message
                    : 'Failed to load data'
            );
        } finally {
            setLoading(false);
        }
    }, [loadAdvisors, loadRules]);

    const handleSelectionChange = useCallback((ids: string[]) => {
        setSelectedRuleIds((current) => {
            if (
                current.length === ids.length &&
                current.every((id, index) => id === ids[index])
            ) {
                return current;
            }
            return ids;
        });
    }, []);

    useEffect(() => {
        void loadPageData();
    }, [loadPageData]);

    useEffect(() => {
        if (searchParams.get('created') === '1') {
            setSuccessMessage('Created New Advisor-Student Assignment!');
        }
    }, [searchParams]);

    async function handleDeleteRules() {
        if (selectedRuleIds.length === 0) return;

        setDeleting(true);
        setError('');
        try {
            await Promise.all(
                selectedRuleIds.map((ruleId) =>
                    quaidApiRequest(
                        `${DELETE_RULE_ENDPOINT_PREFIX}/${ruleId}`,
                        {
                            method: 'DELETE',
                        }
                    )
                )
            );

            const deletedCount = selectedRuleIds.length;
            setSuccessMessage(
                deletedCount === 1
                    ? 'Deleted 1 advisor-student assignment.'
                    : `Deleted ${deletedCount} advisor-student assignments.`
            );
            setSelectedRuleIds([]);
            await loadPageData();
        } catch (deleteError) {
            setError(
                deleteError instanceof Error
                    ? deleteError.message
                    : 'Failed to delete selected rules'
            );
        } finally {
            setDeleting(false);
        }
    }

    const advisorMap = new Map(
        advisors.map((a) => [
            a.advisorId,
            a.name || a.username || a.email || a.advisorId,
        ])
    );

    const allRows: TableRowData[] = rules.map((rule) => {
        const advisorName = advisorMap.get(rule.advisorId) ?? rule.advisorId;
        return {
            id: rule.ruleId,
            name: buildRuleName(rule, advisorName),
            type: rule.conditionType.replace(/_/g, '_'),
            advisor: advisorName,
            priority: rule.priority,
            lastUpdated: formatDate(rule.createdAt),
            actions: '',
        };
    });

    const totalPages = Math.max(1, Math.ceil(allRows.length / perPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const pageStart = (safeCurrentPage - 1) * perPage;
    const rows = allRows.slice(pageStart, pageStart + perPage);

    const pagination: TablePagination = {
        currentPage: safeCurrentPage,
        totalPages,
        perPage,
        totalResults: allRows.length,
    };

    return (
        <div className="flex flex-1 flex-col overflow-auto p-2">
            {successMessage && (
                <SuccessToast
                    message={successMessage}
                    onDismiss={() => setSuccessMessage('')}
                />
            )}
            {error && (
                <p className="mb-2 font-[Arial,sans-serif] text-[0.75rem] text-alert-red">
                    {error}
                </p>
            )}

            <div className="flex flex-col gap-2.5 rounded-sm bg-white p-2.5 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
                <h2 className="font-[Arial,sans-serif] text-[0.875rem] font-bold text-black">
                    Advisor-Student Assignments
                </h2>
                <p className="font-[Arial,sans-serif] text-[0.75rem] text-[#404040]">
                    This table lists the rules used by BuzzPort to map advisors
                    to students so that each student&#39;s advisor is
                    dynamically displayed within their personalized advising
                    card.
                </p>

                <div className="flex items-center justify-end gap-2">
                    {selectedRuleIds.length > 0 && (
                        <Button
                            variant="warning"
                            className="border-alert-red text-alert-red bg-alert-red text-white hover:bg-[#991b1b] hover:text-white"
                            onClick={() => void handleDeleteRules()}
                            disabled={deleting}
                        >
                            {deleting ? 'DELETING...' : 'DELETE RULES'}
                        </Button>
                    )}
                    <Button
                        variant="secondary"
                        href="/advising-configuration/new-rule"
                    >
                        <Image
                            src="/images/plus-icon.svg"
                            alt=""
                            width={16}
                            height={16}
                            className="mr-0.5"
                        />
                        ADD RULE
                    </Button>
                </div>

                {loading ? (
                    <p className="py-4 text-center font-[Arial,sans-serif] text-[0.75rem] text-[#404040]">
                        Loading...
                    </p>
                ) : (
                    <Table
                        columns={TABLE_COLUMNS}
                        rows={rows}
                        pagination={pagination}
                        onPageChange={(page) => setCurrentPage(page)}
                        onPerPageChange={(nextPerPage) => {
                            setPerPage(nextPerPage);
                            setCurrentPage(1);
                            setSelectedRuleIds([]);
                        }}
                        onSelectionChange={handleSelectionChange}
                    />
                )}
            </div>
        </div>
    );
}
