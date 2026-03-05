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

type FormErrors = {
  start?: string;
  end?: string;
  advisorId?: string;
  priority?: string;
};

const SUBMENU_ITEMS = [
  {
    label: "Assign Advisors to Students",
    href: "/advising-configuration",
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
  {
    label: "Advising Insight Playground",
    href: "/advising-configuration/playground",
    active: false,
  },
];

function isValidInitial(value: string): boolean {
  return /^[A-Z]$/.test(value);
}

function ValidationError({ message }: Readonly<{ message: string }>) {
  return (
    <div className="flex h-5.5 items-center gap-2.5 rounded-sm border border-[#f43f5e] bg-[#fee2e2] px-1.5 py-0.5">
      <span className="flex-1 font-[Arial,sans-serif] text-[0.5rem] font-bold text-[#e11d48]">
        {message}
      </span>
      <div className="flex h-3 w-3 items-center justify-center rounded-full bg-[#e11d48]">
        <span className="font-[Arial,sans-serif] text-[0.375rem] font-bold text-white">
          !
        </span>
      </div>
    </div>
  );
}

export default function NewRulePage() {
  const router = useRouter();
  const [advisors, setAdvisors] = useState<AdvisorDirectoryEntry[]>([]);
  const [ruleType] = useState("LAST_NAME");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [advisorId, setAdvisorId] = useState("");
  const [priority, setPriority] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
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

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!start || !isValidInitial(start)) {
      next.start = "Invalid Last Name Initial!";
    }
    if (!end || !isValidInitial(end)) {
      next.end = "Invalid Last Name Initial!";
    }
    if (!advisorId) {
      next.advisorId = "Advisor is required!";
    }
    if (!priority || isNaN(Number(priority)) || Number(priority) < 0) {
      next.priority = "Invalid priority!";
    }
    return next;
  }

  async function handleCreate() {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setError("");
    try {
      await quaidApiRequest("advising/admin/rules", {
        method: "POST",
        body: JSON.stringify({
          advisorId,
          conditionType: "LAST_NAME_RANGE",
          parameters: { start, end },
          priority: Number(priority),
          isActive: true,
        }),
      });
      router.push("/advising-configuration");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create rule",
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
              href="/advising-configuration"
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
              Create a New Advisor-Student Assignment
            </h1>
          </div>

          {error && (
            <p className="mb-2 font-[Arial,sans-serif] text-[0.75rem] text-alert-red">
              {error}
            </p>
          )}

          <div className="flex w-200 max-w-full flex-col gap-6 rounded-sm bg-white p-2 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
            {/* Rule Type */}
            <div className="flex w-56.25 flex-col gap-2">
              <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                * Rule Type
              </label>
              <div className="relative">
                <select
                  value={ruleType}
                  disabled
                  className="h-7 w-full appearance-none border border-[#d1d5db] bg-white pl-10.75 pr-1.5 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none"
                >
                  <option value="LAST_NAME">LAST_NAME</option>
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

            {/* Mapping fields row */}
            <div className="flex items-start gap-0">
              {/* Range Start */}
              <div className="flex w-37 flex-col gap-2">
                <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                  * Range Start (Last Initial)
                </label>
                <input
                  type="text"
                  maxLength={1}
                  value={start}
                  onChange={(e) => setStart(e.target.value.toUpperCase())}
                  className="h-7 w-full border border-[#d1d5db] bg-white px-2.5 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
                />
                {errors.start && <ValidationError message={errors.start} />}
              </div>

              {/* TO label */}
              <div className="flex h-7 w-10 items-center justify-center self-end font-[Arial,sans-serif] text-[0.75rem] text-black">
                TO
              </div>

              {/* Range End */}
              <div className="flex w-[9.35rem] flex-col gap-3">
                <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                  * Range End (Last Initial)
                </label>
                <input
                  type="text"
                  maxLength={1}
                  value={end}
                  onChange={(e) => setEnd(e.target.value.toUpperCase())}
                  className="h-7 w-full border border-[#d1d5db] bg-white px-2.5 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
                />
                {errors.end && <ValidationError message={errors.end} />}
              </div>

              {/* Arrow icon */}
              <div className="flex h-7 w-10 items-center justify-center self-end">
                <Image
                  src="/images/arrow-forward.svg"
                  alt=""
                  width={24}
                  height={24}
                />
              </div>

              {/* Assigned Advisor */}
              <div className="flex w-56 flex-col gap-2.5">
                <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                  * Assigned Advisor
                </label>
                <div className="relative">
                  <select
                    value={advisorId}
                    onChange={(e) => setAdvisorId(e.target.value)}
                    className="h-7 w-full appearance-none border border-[#d1d5db] bg-white pl-10.75 pr-1.5 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
                  >
                    <option value="">Advisor ID</option>
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
                {errors.advisorId && (
                  <ValidationError message={errors.advisorId} />
                )}
              </div>

              {/* Priority */}
              <div className="ml-2.5 flex w-13.25 flex-col gap-2.5">
                <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
                  * Priority
                </label>
                <input
                  type="text"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="h-7 w-full border border-[#d1d5db] bg-white px-1.5 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
                />
              </div>
            </div>

            {/* CREATE RULE button */}
            <div className="flex flex-col items-end">
              <Button
                variant="secondary"
                className="w-33.25"
                onClick={() => void handleCreate()}
                disabled={submitting}
              >
                {submitting ? "CREATING..." : "CREATE RULE"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
