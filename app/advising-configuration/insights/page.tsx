"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import { quaidApiRequest } from "@/lib/quaid-api-client";
import type {
  AdvisingInsight,
  AdvisingInsightsResponse,
  AdvisorDirectoryEntry,
  AdvisorDirectoryResponse,
} from "@/lib/quaid-api-types";
import type {
  TableColumn,
  TableRowData,
  TablePagination,
} from "@/lib/table-types";

const TABLE_COLUMNS: TableColumn[] = [
  { key: "name", label: "Name", width: "17.5rem" },
  { key: "templateKey", label: "Template Key", width: "7.5625rem" },
  { key: "advisor", label: "Advisor", width: "6.6875rem" },
  { key: "filters", label: "Filters", width: "13.5rem" },
  { key: "lastUpdated", label: "Last Updated", width: "8.0625rem" },
  { key: "actions", label: "Actions", width: "2.5625rem" },
];

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

function formatParameters(params: Record<string, unknown>): string {
  return Object.entries(params)
    .map(([key, value]) => `${key} = '${String(value)}'`)
    .join(" AND ");
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
    <div className="flex h-7 items-center gap-2.5 rounded-sm border border-[#16a34a] bg-[#dcfce7] px-1.5 py-0.5">
      <span className="flex-1 font-[Arial,sans-serif] text-[0.75rem] font-bold text-[#16a34a]">
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

export default function AdvisingInsightsPage() {
  return (
    <Suspense>
      <AdvisingInsightsContent />
    </Suspense>
  );
}

function AdvisingInsightsContent() {
  const searchParams = useSearchParams();
  const [insights, setInsights] = useState<AdvisingInsight[]>([]);
  const [advisors, setAdvisors] = useState<AdvisorDirectoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    searchParams.get("created") === "1"
      ? "Created New Advising Insight!"
      : "",
  );

  const loadInsights = useCallback(async () => {
    const response = await quaidApiRequest<AdvisingInsightsResponse>(
      "advising/insights",
    );
    setInsights(response.data);
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
      await Promise.all([loadInsights(), loadAdvisors()]);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load data",
      );
    } finally {
      setLoading(false);
    }
  }, [loadInsights, loadAdvisors]);

  useEffect(() => {
    void loadPageData();
  }, [loadPageData]);

  const advisorMap = new Map(
    advisors.map((a) => [
      a.advisorId,
      a.name || a.username || a.email || a.advisorId,
    ]),
  );

  const rows: TableRowData[] = insights.map((insight) => ({
    id: insight.insightId,
    name: insight.name,
    templateKey: insight.templateKey,
    advisor: advisorMap.get(insight.advisorId) ?? insight.advisorId,
    filters: formatParameters(insight.parameters),
    lastUpdated: formatDate(insight.updatedAt || insight.createdAt),
    actions: "",
  }));

  const pagination: TablePagination = {
    currentPage: 1,
    totalPages: Math.max(1, Math.ceil(insights.length / 10)),
    perPage: 10,
    totalResults: insights.length,
  };

  return (
    <div className="flex flex-1 flex-col overflow-auto p-2">
      {error && (
        <p className="mb-2 font-[Arial,sans-serif] text-[0.75rem] text-alert-red">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2.5 rounded-sm bg-white p-2.5 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
        <h2 className="font-[Arial,sans-serif] text-[0.875rem] font-bold text-black">
          Advising Insights Designer
        </h2>
        <p className="font-[Arial,sans-serif] text-[0.75rem] text-[#404040]">
          This table lists the advising insights you&#39;ve created. Each
          advising insight is bound to a pre-defined SQL query that is executed
          to conditionally display a template message in a student&#39;s
          advising card.
        </p>

        <div className="flex items-start justify-between">
          {successMessage ? (
            <SuccessToast
              message={successMessage}
              onDismiss={() => setSuccessMessage("")}
            />
          ) : (
            <div />
          )}
          <Button
            variant="secondary"
            href="/advising-configuration/insights/new"
          >
            <Image
              src="/images/plus-icon.svg"
              alt=""
              width={16}
              height={16}
              className="mr-0.5"
            />
            ADD INSIGHT
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
  );
}
