"use client";

import { useEffect, useState } from "react";
import { SmallNav } from "@/components/layout/Navbar";
import { quaidApiRequest } from "@/lib/quaid-api-client";
import type {
  AdvisingInsight,
  AdvisingInsightsResponse,
} from "@/lib/quaid-api-types";

type TemplateKey =
  | "CREDENTIALS_NEAR_COMPLETION"
  | "SCHOLARSHIP_ELIGIBILITY"
  | "SUGGESTED_COURSES";

const defaultTemplate: TemplateKey = "SUGGESTED_COURSES";

export default function InsightDesignerPage() {
  const [insights, setInsights] = useState<AdvisingInsight[]>([]);
  const [selectedInsightId, setSelectedInsightId] = useState("");
  const [name, setName] = useState("");
  const [templateKey, setTemplateKey] = useState<TemplateKey>(defaultTemplate);
  const [parametersText, setParametersText] = useState("{}");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const selectedInsight = insights.find(
    (insight) => insight.insightId === selectedInsightId,
  );

  const loadInsights = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await quaidApiRequest<AdvisingInsightsResponse>(
        "advising/insights",
      );
      setInsights(response.data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load insights",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInsights();
  }, []);

  useEffect(() => {
    if (!selectedInsight) {
      return;
    }

    setName(selectedInsight.name);
    setTemplateKey(selectedInsight.templateKey);
    setParametersText(JSON.stringify(selectedInsight.parameters, null, 2));
  }, [selectedInsight]);

  const parseParameters = () => JSON.parse(parametersText) as Record<string, unknown>;

  const createInsight = async () => {
    setError("");
    setMessage("");

    try {
      await quaidApiRequest("advising/insights", {
        method: "POST",
        body: JSON.stringify({
          name,
          templateKey,
          parameters: parseParameters(),
        }),
      });
      setMessage("Insight created.");
      await loadInsights();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create insight",
      );
    }
  };

  const updateInsight = async () => {
    if (!selectedInsightId) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await quaidApiRequest(`advising/insights/${selectedInsightId}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          templateKey,
          parameters: parseParameters(),
        }),
      });
      setMessage("Insight updated.");
      await loadInsights();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update insight",
      );
    }
  };

  const deleteInsight = async () => {
    if (!selectedInsightId) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await quaidApiRequest(`advising/insights/${selectedInsightId}`, {
        method: "DELETE",
      });
      setSelectedInsightId("");
      setName("");
      setTemplateKey(defaultTemplate);
      setParametersText("{}");
      setMessage("Insight deleted.");
      await loadInsights();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete insight",
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <SmallNav />
      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8">
        <h1 className="font-[family-name:Arial,sans-serif] text-3xl font-bold text-black">
          Insight Designer
        </h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void loadInsights()}
            className="rounded border border-[#d1d5db] px-3 py-1.5 text-sm font-bold text-[#404040]"
          >
            Refresh
          </button>
          {loading && <span className="text-sm text-[#404040]">Loading...</span>}
        </div>

        {error && <p className="text-sm text-alert-red">{error}</p>}
        {message && <p className="text-sm text-[#166534]">{message}</p>}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded border border-[#e5e7eb] p-4">
            <h2 className="mb-2 text-lg font-bold text-black">Existing Insights</h2>
            {insights.length === 0 ? (
              <p className="text-sm text-[#404040]">No insights found.</p>
            ) : (
              <ul className="space-y-2">
                {insights.map((insight) => (
                  <li key={insight.insightId}>
                    <button
                      type="button"
                      onClick={() => setSelectedInsightId(insight.insightId)}
                      className={`w-full rounded border px-3 py-2 text-left text-sm ${
                        insight.insightId === selectedInsightId
                          ? "border-link-blue"
                          : "border-[#e5e7eb]"
                      }`}
                    >
                      <p className="font-bold text-black">{insight.name}</p>
                      <p className="text-[#404040]">{insight.templateKey}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded border border-[#e5e7eb] p-4">
            <h2 className="mb-2 text-lg font-bold text-black">
              {selectedInsightId ? "Edit Insight" : "Create Insight"}
            </h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#404040]">
                Name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 h-9 w-full border border-[#d1d5db] px-2"
                />
              </label>
              <label className="text-sm text-[#404040]">
                Template
                <select
                  value={templateKey}
                  onChange={(event) =>
                    setTemplateKey(event.target.value as TemplateKey)
                  }
                  className="mt-1 h-9 w-full border border-[#d1d5db] px-2"
                >
                  <option value="CREDENTIALS_NEAR_COMPLETION">
                    CREDENTIALS_NEAR_COMPLETION
                  </option>
                  <option value="SCHOLARSHIP_ELIGIBILITY">
                    SCHOLARSHIP_ELIGIBILITY
                  </option>
                  <option value="SUGGESTED_COURSES">SUGGESTED_COURSES</option>
                </select>
              </label>
              <label className="text-sm text-[#404040]">
                Parameters (JSON)
                <textarea
                  value={parametersText}
                  onChange={(event) => setParametersText(event.target.value)}
                  className="mt-1 min-h-36 w-full border border-[#d1d5db] p-2 font-mono text-xs"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {!selectedInsightId && (
                  <button
                    type="button"
                    onClick={createInsight}
                    className="rounded bg-link-blue px-3 py-1.5 text-sm font-bold text-white"
                  >
                    Create
                  </button>
                )}
                {selectedInsightId && (
                  <>
                    <button
                      type="button"
                      onClick={updateInsight}
                      className="rounded bg-link-blue px-3 py-1.5 text-sm font-bold text-white"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={deleteInsight}
                      className="rounded border border-[#b91c1c] px-3 py-1.5 text-sm font-bold text-[#b91c1c]"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
