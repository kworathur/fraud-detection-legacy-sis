"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SmallNav } from "@/components/layout/Navbar";
import { quaidApiRequest } from "@/lib/quaid-api-client";
import type {
  AdvisorDirectoryEntry,
  AdvisorDirectoryResponse,
} from "@/lib/quaid-api-types";

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

export default function AdvisorAdviseeMappingsPage() {
  const [rules, setRules] = useState<AdvisingRule[]>([]);
  const [advisors, setAdvisors] = useState<AdvisorDirectoryEntry[]>([]);
  const [advisorId, setAdvisorId] = useState("");
  const [start, setStart] = useState("A");
  const [end, setEnd] = useState("Z");
  const [priority, setPriority] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedAdvisor = useMemo(
    () => advisors.find((advisor) => advisor.advisorId === advisorId),
    [advisors, advisorId],
  );

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
    if (!advisorId && response.data.length > 0) {
      setAdvisorId(response.data[0]?.advisorId ?? "");
    }
  }, [advisorId]);

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

  const createRule = async () => {
    setError("");
    setMessage("");

    try {
      await quaidApiRequest("advising/admin/rules", {
        method: "POST",
        body: JSON.stringify({
          advisorId,
          conditionType: "LAST_NAME_RANGE",
          parameters: { start, end },
          priority,
          isActive: true,
        }),
      });
      setMessage("Rule created.");
      await loadRules();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create rule",
      );
    }
  };

  const toggleRule = async (rule: AdvisingRule) => {
    setError("");
    setMessage("");

    try {
      await quaidApiRequest(`advising/admin/rules/${rule.ruleId}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: !rule.isActive }),
      });
      setMessage("Rule updated.");
      await loadRules();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update rule",
      );
    }
  };

  const deleteRule = async (ruleId: string) => {
    setError("");
    setMessage("");

    try {
      await quaidApiRequest(`advising/admin/rules/${ruleId}`, {
        method: "DELETE",
      });
      setMessage("Rule deleted.");
      await loadRules();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete rule",
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <SmallNav />
      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8">
        <h1 className="font-[family-name:Arial,sans-serif] text-3xl font-bold text-black">
          Advising Configuration
        </h1>

        {error && <p className="text-sm text-alert-red">{error}</p>}
        {message && <p className="text-sm text-[#166534]">{message}</p>}

        <section className="rounded border border-[#e5e7eb] p-4">
          <h2 className="mb-2 text-lg font-bold text-black">Add Mapping Rule</h2>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
            <label className="text-sm text-[#404040] md:col-span-2">
              Advisor
              <select
                value={advisorId}
                onChange={(event) => setAdvisorId(event.target.value)}
                className="mt-1 h-9 w-full border border-[#d1d5db] px-2"
              >
                {advisors.map((advisor) => (
                  <option key={advisor.advisorId} value={advisor.advisorId}>
                    {(advisor.name || advisor.username || advisor.email || advisor.advisorId).trim()}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-[#404040]">
              Last Name Start
              <input
                value={start}
                maxLength={1}
                onChange={(event) => setStart(event.target.value.toUpperCase())}
                className="mt-1 h-9 w-full border border-[#d1d5db] px-2"
              />
            </label>
            <label className="text-sm text-[#404040]">
              Last Name End
              <input
                value={end}
                maxLength={1}
                onChange={(event) => setEnd(event.target.value.toUpperCase())}
                className="mt-1 h-9 w-full border border-[#d1d5db] px-2"
              />
            </label>
            <label className="text-sm text-[#404040]">
              Priority
              <input
                type="number"
                min={0}
                value={priority}
                onChange={(event) => setPriority(Number(event.target.value || 0))}
                className="mt-1 h-9 w-full border border-[#d1d5db] px-2"
              />
            </label>
          </div>

          <div className="mt-2 text-xs text-[#6b7280]">
            Selected advisor: {selectedAdvisor?.name || selectedAdvisor?.email || selectedAdvisor?.advisorId || "None"}
          </div>

          <button
            type="button"
            onClick={createRule}
            disabled={!advisorId}
            className="mt-3 rounded bg-link-blue px-3 py-1.5 text-sm font-bold text-white disabled:opacity-50"
          >
            Save Rule
          </button>
        </section>

        <section className="rounded border border-[#e5e7eb] p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold text-black">Existing Rules</h2>
            <button
              type="button"
              onClick={() => void loadPageData()}
              className="rounded border border-[#d1d5db] px-3 py-1 text-sm font-bold text-[#404040]"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-[#404040]">Loading...</p>
          ) : rules.length === 0 ? (
            <p className="text-sm text-[#404040]">No rules found.</p>
          ) : (
            <ul className="space-y-2">
              {rules.map((rule) => (
                <li
                  key={rule.ruleId}
                  className="rounded border border-[#f3f4f6] p-3 text-sm text-[#111827]"
                >
                  <p>
                    <strong>Advisor:</strong> {rule.advisorId}
                  </p>
                  <p>
                    <strong>Range:</strong> {String(rule.parameters.start ?? "")} -{" "}
                    {String(rule.parameters.end ?? "")}
                  </p>
                  <p>
                    <strong>Priority:</strong> {rule.priority}
                  </p>
                  <p>
                    <strong>Active:</strong> {rule.isActive ? "Yes" : "No"}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => void toggleRule(rule)}
                      className="rounded border border-[#d1d5db] px-2 py-1 text-xs font-bold text-[#404040]"
                    >
                      {rule.isActive ? "Disable" : "Enable"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteRule(rule.ruleId)}
                      className="rounded border border-[#b91c1c] px-2 py-1 text-xs font-bold text-[#b91c1c]"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
