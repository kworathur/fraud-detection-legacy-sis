'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { SmallNav } from '@/components/layout/Navbar';
import NavigationSubmenu from '@/components/ui/NavigationSubmenu';
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

const SUBMENU_ITEMS = [
    {
        label: 'Assign Advisors to Students',
        href: '/advising-configuration',
        active: true,
    },
    {
        label: 'Pause/Unpause Virtual Advising',
        href: '/advising-configuration/virtual-advising',
        active: false,
    },
    {
        label: 'Customize Advising Insights',
        href: '/advising-configuration/insights',
        active: false,
    },
];

const TABLE_COLUMNS: TableColumn[] = [
    { key: 'name', label: 'Name', width: '27.75rem' },
    { key: 'type', label: 'Type', width: '6.9375rem' },
    { key: 'advisor', label: 'Advisor', width: '6.6875rem' },
    { key: 'priority', label: 'Priority', width: '6.125rem' },
    { key: 'lastUpdated', label: 'Last Updated', width: '8.1875rem' },
    { key: 'actions', label: 'Actions' },
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

export default function AdvisorAdviseeMappingsPage() {
    const [rules, setRules] = useState<AdvisingRule[]>([]);
    const [advisors, setAdvisors] = useState<AdvisorDirectoryEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadRules = useCallback(async () => {
        const response = await quaidApiRequest<RuleListResponse>(
            'advising/admin/rules?limit=100'
        );
        setRules(response.data);
    }, []);

    const loadAdvisors = useCallback(async () => {
        const response = await quaidApiRequest<AdvisorDirectoryResponse>(
            'advising/admin/advisors?offset=0&limit=60'
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

    useEffect(() => {
        void loadPageData();
    }, [loadPageData]);

    const advisorMap = new Map(
        advisors.map((a) => [
            a.advisorId,
            a.name || a.username || a.email || a.advisorId,
        ])
    );

    const rows: TableRowData[] = rules.map((rule) => {
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

    const pagination: TablePagination = {
        currentPage: 1,
        totalPages: Math.max(1, Math.ceil(rules.length / 10)),
        perPage: 10,
        totalResults: rules.length,
    };

    return (
        <div className="min-h-screen w-full bg-white flex flex-col">
            <SmallNav />
            {/* TODO: Should use formheader? */}
            <div className="flex h-11 items-center border-b border-[#d4d4d4] bg-white pl-3.75 pr-2.5">
                <h1 className="font-[Arial,sans-serif] text-[1.125rem] font-bold text-black">
                    Advising Configuration
                </h1>
            </div>

            <div className="flex flex-1">
                <NavigationSubmenu items={SUBMENU_ITEMS} />

                <div className="flex flex-1 flex-col p-2">
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
                            This table lists the rules used by BuzzPort to map
                            advisors to students so that each student&#39;s
                            advisor is dynamically displayed within their
                            personalized advising card.
                        </p>

                        <div className="flex flex-col items-end">
                            <Button variant="secondary">
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
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
