"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import { quaidApiRequest } from "@/lib/quaid-api-client";
import type {
  AdvisorDirectoryEntry,
  AdvisorDirectoryResponse,
} from "@/lib/quaid-api-types";

const TEMPLATE_KEYS = [
  "CREDENTIALS_NEAR_COMPLETION",
  "SCHOLARSHIP_ELIGIBILITY",
  "SUGGESTED_COURSES",
];

const SCHOLARSHIP_OPTIONS = ["ZELL_MILLER", "HOPE", "PELL"];

const TEMPLATE_VARIABLES: Record<string, { vars: string[]; example: string }> = {
  CREDENTIALS_NEAR_COMPLETION: {
    vars: [
      "student_name",
      "program_name",
      "program_code",
      "completion_pct",
    ],
    example:
      "Hi {{student_name}}, you have completed {{completion_pct}}% of the {{program_name}} ({{program_code}}) program!",
  },
  SCHOLARSHIP_ELIGIBILITY: {
    vars: [
      "student_name",
      "scholarship_name",
      "status",
      "reason",
      "rule_type",
      "rule_operator",
      "rule_value",
    ],
    example:
      "Hi {{student_name}}, your {{scholarship_name}} scholarship status is {{status}}.",
  },
  SUGGESTED_COURSES: {
    vars: [
      "student_name",
      "subject_code",
      "course_number",
      "course_name",
      "credit_hours",
      "description",
    ],
    example:
      "Hi {{student_name}}, consider taking {{subject_code}} {{course_number}} – {{course_name}} ({{credit_hours}} credits).",
  },
};

export default function NewInsightPage() {
  const router = useRouter();
  const [advisors, setAdvisors] = useState<AdvisorDirectoryEntry[]>([]);
  const [advisorId, setAdvisorId] = useState("");
  const [templateKey, setTemplateKey] = useState("");
  const [thresholdPercentage, setThresholdPercentage] = useState("");
  const [scholarshipName, setScholarshipName] = useState("");
  const [department, setDepartment] = useState("");
  const [messageTemplate, setMessageTemplate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadAdvisors = useCallback(async () => {
    try {
      const response = await quaidApiRequest<AdvisorDirectoryResponse>(
        "advising/admin/advisors?offset=0&limit=60",
      );
      setAdvisors(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load advisors");
    }
  }, []);

  useEffect(() => {
    void loadAdvisors();
  }, [loadAdvisors]);

  function buildParameters(): Record<string, unknown> {
    switch (templateKey) {
      case "CREDENTIALS_NEAR_COMPLETION":
        return { threshold_percentage: Number(thresholdPercentage) };
      case "SCHOLARSHIP_ELIGIBILITY":
        return { scholarship_name: scholarshipName };
      case "SUGGESTED_COURSES":
        return department ? { department } : {};
      default:
        return {};
    }
  }

  async function handleCreate() {
    if (!templateKey) return;

    setSubmitting(true);
    setError("");
    try {
      await quaidApiRequest("advising/insights", {
        method: "POST",
        body: JSON.stringify({
          advisorId: advisorId || undefined,
          templateKey,
          name: `${templateKey}_insight`,
          parameters: buildParameters(),
          messageTemplate: messageTemplate || undefined,
        }),
      });
      router.push("/advising-configuration/insights?created=1");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create insight",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto px-6 py-4">
      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/advising-configuration/insights"
          className="flex items-center justify-center"
        >
          <Image src="/images/arrow-back.svg" alt="Back" width={16} height={16} />
        </Link>
        <h1 className="font-[Arial,sans-serif] text-[1rem] font-bold text-black">
          Edit Advising Insight
        </h1>
      </div>

      {error && (
        <p className="mb-2 font-[Arial,sans-serif] text-[0.75rem] text-alert-red">
          {error}
        </p>
      )}

      <div className="flex w-214.75 max-w-full flex-col gap-6 rounded-sm bg-white p-2 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="flex flex-wrap items-start gap-8.25">
          <div className="flex w-56 flex-col gap-2.5">
            <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
              Apply to Advisor
            </label>
            <Dropdown
              value={advisorId}
              onChange={setAdvisorId}
              placeholder="-- Select Advisor --"
              options={advisors.map((advisor) => ({
                value: advisor.advisorId,
                label: (
                  advisor.name ||
                  advisor.username ||
                  advisor.email ||
                  advisor.advisorId
                ).trim(),
              }))}
            />
          </div>

          <div className="flex w-58.5 flex-col gap-2.5">
            <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
              *Template Key
            </label>
            <Dropdown
              value={templateKey}
              onChange={setTemplateKey}
              placeholder="-- Select Template --"
              options={TEMPLATE_KEYS.map((key) => ({ value: key, label: key }))}
            />
          </div>

          {templateKey === "CREDENTIALS_NEAR_COMPLETION" && (
            <div className="flex w-56 flex-col gap-2.5">
              <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                *Threshold Percentage (0–100)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={thresholdPercentage}
                onChange={(e) => setThresholdPercentage(e.target.value)}
                placeholder="e.g. 80"
                className="h-7 w-full border border-[#d1d5db] bg-white px-2.5 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
              />
            </div>
          )}

          {templateKey === "SCHOLARSHIP_ELIGIBILITY" && (
            <div className="flex w-56 flex-col gap-2.5">
              <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                *Scholarship Name
              </label>
              <Dropdown
                value={scholarshipName}
                onChange={setScholarshipName}
                placeholder="-- Select Scholarship --"
                options={SCHOLARSHIP_OPTIONS.map((s) => ({ value: s, label: s }))}
              />
            </div>
          )}

          {templateKey === "SUGGESTED_COURSES" && (
            <div className="flex w-56 flex-col gap-2.5">
              <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                Department (optional)
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. CS"
                className="h-7 w-full border border-[#d1d5db] bg-white px-2.5 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
              />
            </div>
          )}

          <div className="flex w-78.25 flex-col gap-2">
            <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
              Message Template
            </label>
            {templateKey && TEMPLATE_VARIABLES[templateKey] && (
              <p className="font-[Arial,sans-serif] text-[0.625rem] leading-tight text-[#6b7280]">
                Available variables:{" "}
                {TEMPLATE_VARIABLES[templateKey].vars.map((v) => (
                  <code
                    key={v}
                    className="mx-0.5 rounded bg-[#f3f4f6] px-1 py-0.5 font-[Inconsolata,monospace] text-[0.625rem] text-[#374151]"
                  >
                    {`{{${v}}}`}
                  </code>
                ))}
              </p>
            )}
            <textarea
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              placeholder={
                templateKey && TEMPLATE_VARIABLES[templateKey]
                  ? TEMPLATE_VARIABLES[templateKey].example
                  : "Select a template key to see available variables"
              }
              className="h-17.5 w-full resize-none border border-[#d1d5db] bg-white p-1 font-[Arial,sans-serif] text-[0.75rem] text-black placeholder:text-[#9ca3af] outline-none focus:border-[#3182ce]"
            />
          </div>
        </div>

        <div className="flex flex-col items-end">
          <Button
            variant="secondary"
            className="w-33.25"
            onClick={() => void handleCreate()}
            disabled={submitting}
          >
            {submitting ? "CREATING..." : "CREATE INSIGHT"}
          </Button>
        </div>
      </div>
    </div>
  );
}
