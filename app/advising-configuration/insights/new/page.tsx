"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SmallNav } from "@/components/layout/Navbar";
import FormHeader from "@/components/ui/FormHeader";
import NavigationSubmenu from "@/components/ui/NavigationSubmenu";
import Button from "@/components/ui/Button";
import { quaidApiRequest } from "@/lib/quaid-api-client";
import type {
  AdvisorDirectoryEntry,
  AdvisorDirectoryResponse,
} from "@/lib/quaid-api-types";

const SUBMENU_ITEMS = [
  {
    label: "Assign Advisors to Students",
    href: "/advising-configuration",
    active: false,
  },
  {
    label: "Pause/Unpause Virtual Advising",
    href: "/advising-configuration/virtual-advising",
    active: false,
  },
  {
    label: "Customize Advising Insights",
    href: "/advising-configuration/insights",
    active: true,
  },
  {
    label: "Advising Insight Playground",
    href: "/advising-configuration/playground",
    active: false,
  },
];

const TEMPLATE_KEYS = [
  "CREDENTIALS_NEAR_COMPLETION",
  "SCHOLARSHIP_ELIGIBILITY",
  "SUGGESTED_COURSES",
];

export default function NewInsightPage() {
  const router = useRouter();
  const [advisors, setAdvisors] = useState<AdvisorDirectoryEntry[]>([]);
  const [advisorId, setAdvisorId] = useState("");
  const [templateKey, setTemplateKey] = useState("");
  const [triggerCondition, setTriggerCondition] = useState("");
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
      setError(
        err instanceof Error ? err.message : "Failed to load advisors",
      );
    }
  }, []);

  useEffect(() => {
    void loadAdvisors();
  }, [loadAdvisors]);

  async function handleCreate() {
    if (!templateKey) return;

    setSubmitting(true);
    setError("");
    try {
      await quaidApiRequest("advising/admin/insights", {
        method: "POST",
        body: JSON.stringify({
          advisorId: advisorId || undefined,
          templateKey,
          name: `${templateKey}_insight`,
          parameters: {
            triggerCondition,
            messageTemplate,
          },
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
    <div className="flex h-screen w-full flex-col bg-white">
      <SmallNav />
      <FormHeader title="Advising Configuration" />

      <div className="flex flex-1 overflow-hidden">
        <NavigationSubmenu items={SUBMENU_ITEMS} />

        <div className="flex flex-1 flex-col overflow-auto px-6 py-4">
          <div className="mb-4 flex items-center gap-2">
            <Link
              href="/advising-configuration/insights"
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
              Edit Advising Insight
            </h1>
          </div>

          {error && (
            <p className="mb-2 font-[Arial,sans-serif] text-[0.75rem] text-alert-red">
              {error}
            </p>
          )}

          <div className="flex w-214.75 max-w-full flex-col gap-6 rounded-sm bg-white p-2 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
            {/* Form fields - wrapping row */}
            <div className="flex flex-wrap items-start gap-8.25">
              {/* Apply to Advisor */}
              <div className="flex w-56 flex-col gap-2.5">
                <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                  Apply to Advisor
                </label>
                <div className="relative">
                  <select
                    value={advisorId}
                    onChange={(e) => setAdvisorId(e.target.value)}
                    className="h-7 w-full appearance-none border border-[#d1d5db] bg-white pl-10.75 pr-1.5 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
                  >
                    <option value="">-- Select Advisor --</option>
                    {advisors.map((advisor) => (
                      <option key={advisor.advisorId} value={advisor.advisorId}>
                        {(
                          advisor.name ||
                          advisor.username ||
                          advisor.email ||
                          advisor.advisorId
                        ).trim()}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2">
                    <Image
                      src="/images/chevron-down.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              </div>

              {/* Template Key */}
              <div className="flex w-58.5 flex-col gap-2.5">
                <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                  *Template Key
                </label>
                <div className="relative">
                  <select
                    value={templateKey}
                    onChange={(e) => setTemplateKey(e.target.value)}
                    className="h-7 w-full appearance-none border border-[#d1d5db] bg-white pl-10.75 pr-1.5 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
                  >
                    <option value="">-- Select Template --</option>
                    {TEMPLATE_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2">
                    <Image
                      src="/images/chevron-down.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              </div>

              {/* Trigger Condition */}
              <div className="flex w-78.25 flex-col gap-2.5">
                <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                  Trigger Condition
                </label>
                <textarea
                  value={triggerCondition}
                  onChange={(e) => setTriggerCondition(e.target.value)}
                  className="h-10.75 w-full resize-none border border-[#d4d4d4] bg-white p-1 font-[Inconsolata,monospace] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
                />
              </div>

              {/* Message Template */}
              <div className="flex w-78.25 flex-col gap-2">
                <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                  Message Template
                </label>
                <textarea
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  className="h-17.5 w-full resize-none border border-[#d1d5db] bg-white p-1 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
                />
              </div>
            </div>

            {/* CREATE INSIGHT button */}
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
      </div>
    </div>
  );
}
