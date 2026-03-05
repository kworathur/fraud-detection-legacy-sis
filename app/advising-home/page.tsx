"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { SmallNav } from "@/components/layout/Navbar";
import FormHeader from "@/components/ui/FormHeader";
import NavigationSubmenu from "@/components/ui/NavigationSubmenu";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import { quaidApiRequest } from "@/lib/quaid-api-client";
import type {
  AdvisorDirectoryEntry,
  AdvisorDirectoryResponse,
} from "@/lib/quaid-api-types";
import type {
  TableColumn,
  TableRowData,
  TablePagination,
} from "@/lib/table-types";

type AdvisingRule = {
  ruleId: string;
  advisorId: string;
  conditionType: "LAST_NAME_RANGE";
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
    label: "Your Assigned Students",
    href: "/advising-home",
    active: true,
  },
  {
    label: "Pause/Unpause Virtual Advising",
    href: "/advising-configuration/virtual-advising",
    active: false,
  },
  {
    label: "Customize Advising Insights",
    href: "/advising-configuration/insights",
    active: false,
  },
];

const TABLE_COLUMNS: TableColumn[] = [
  { key: "name", label: "Name", width: "27.75rem" },
  { key: "type", label: "Type", width: "6.9375rem" },
  { key: "advisor", label: "Advisor", width: "6.6875rem" },
  { key: "priority", label: "Priority", width: "6.125rem" },
  { key: "lastUpdated", label: "Last Updated", width: "8.1875rem" },
  { key: "actions", label: "Actions" },
];

function buildRuleName(rule: AdvisingRule, advisorName: string): string {
  const range = `${rule.parameters.start ?? ""}–${rule.parameters.end ?? ""}`;
  const shortAdvisor = advisorName
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
  return `Last_Name_${range}_${shortAdvisor}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
}

export default function AdvisingHomePage() {
  const [rules, setRules] = useState<AdvisingRule[]>([]);
  const [advisors, setAdvisors] = useState<AdvisorDirectoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRules = useCallback(async () => {
    const response = await quaidApiRequest<RuleListResponse>(
      "advising/admin/rules?limit=100",
    );
    setRules(response.data);
  }, []);

  const loadAdvisors = useCallback(async () => {
    const response = await quaidApiRequest<AdvisorDirectoryResponse>(
      "advising/admin/advisors?offset=0&limit=60",
    );
    setAdvisors(response.data);
  }, []);

  const loadPageData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([loadRules(), loadAdvisors()]);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load data",
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
    ]),
  );

  const rows: TableRowData[] = rules.map((rule) => {
    const advisorName = advisorMap.get(rule.advisorId) ?? rule.advisorId;
    return {
      id: rule.ruleId,
      name: buildRuleName(rule, advisorName),
      type: rule.conditionType.replace(/_/g, "_"),
      advisor: advisorName,
      priority: rule.priority,
      lastUpdated: formatDate(rule.createdAt),
      actions: "",
    };
  });

  const pagination: TablePagination = {
    currentPage: 1,
    totalPages: Math.max(1, Math.ceil(rules.length / 10)),
    perPage: 10,
    totalResults: rules.length,
  };

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      <SmallNav />
      <FormHeader title="Advising Home" />

      <div className="flex flex-1 overflow-hidden">
        <NavigationSubmenu items={SUBMENU_ITEMS} />

        <div className="flex flex-1 flex-col overflow-auto p-2">
          {error && (
            <p className="mb-2 font-[Arial,sans-serif] text-[0.75rem] text-alert-red">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2 border border-[#e5e7eb] bg-white p-2">
            <h2 className="font-[Arial,sans-serif] text-[0.75rem] font-bold text-black">
              Your Assigned Students
            </h2>
            <div className="flex items-start justify-between gap-2">
              <p className="font-[Arial,sans-serif] text-[0.625rem] text-[#404040]">
                List of all students currently assigned to you.
              </p>
              <Button
                variant="secondary"
                href="/advising-configuration/new-rule"
                className="h-4 px-2 py-0 text-[0.5rem]"
              >
                <Image
                  src="/images/plus-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="mr-0.5 h-2.75 w-2.75"
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
