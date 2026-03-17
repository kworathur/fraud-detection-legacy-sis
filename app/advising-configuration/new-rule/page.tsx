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

type FormErrors = {
  start?: string;
  end?: string;
  advisorId?: string;
  priority?: string;
};

type CreateRuleRequest = {
  advisorId: string;
  conditionType: "LAST_NAME_RANGE";
  parameters: {
    start: string;
    end: string;
  };
  priority: number;
  isActive: boolean;
};

type ExistingRule = {
  ruleId: string;
  advisorId: string;
  conditionType: "LAST_NAME_RANGE";
  parameters: {
    start?: string;
    end?: string;
  };
};

type RuleListResponse = {
  data: ExistingRule[];
};

const ADVISOR_DIRECTORY_ENDPOINT = "advising/admin/advisors?offset=0&limit=60";
const CREATE_RULE_ENDPOINT = "advising/admin/rules";
const LIST_RULES_ENDPOINT = "advising/admin/rules?limit=500";

function isValidInitial(value: string): boolean {
  return /^[A-Z]$/.test(value);
}

function ValidationError({ message }: Readonly<{ message: string }>) {
  return (
    <div className="mt-1 flex items-center gap-2 rounded-sm border border-[#f43f5e] bg-[#fee2e2] px-1.5 py-1">
      <span className="flex-1 font-[Arial,sans-serif] text-[0.625rem] font-bold text-[#e11d48]">
        {message}
      </span>
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
        ADVISOR_DIRECTORY_ENDPOINT,
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
      const existingRules = await quaidApiRequest<RuleListResponse>(
        LIST_RULES_ENDPOINT,
      );

      const normalizedStart = start.toUpperCase();
      const normalizedEnd = end.toUpperCase();
      const hasDuplicate = existingRules.data.some((rule) => {
        if (rule.conditionType !== "LAST_NAME_RANGE") {
          return false;
        }

        return (
          rule.advisorId === advisorId &&
          (rule.parameters.start ?? "").toUpperCase() === normalizedStart &&
          (rule.parameters.end ?? "").toUpperCase() === normalizedEnd
        );
      });

      if (hasDuplicate) {
        setError(
          "A rule with this advisor and last-name range already exists.",
        );
        return;
      }

      const payload: CreateRuleRequest = {
        advisorId,
        conditionType: "LAST_NAME_RANGE",
        parameters: { start: normalizedStart, end: normalizedEnd },
        priority: Number(priority),
        isActive: true,
      };

      await quaidApiRequest(CREATE_RULE_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      router.push("/advising-configuration?created=1");
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

      <div className="flex w-216 max-w-full flex-col gap-5 rounded-sm bg-white p-3 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="flex w-56.25 flex-col gap-2">
          <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
            * Rule Type
          </label>
          <Dropdown
            value={ruleType}
            onChange={() => {}}
            disabled
            options={[{ value: "LAST_NAME", label: "LAST_NAME" }]}
            placeholder="LAST_NAME"
          />
        </div>

        <div className="flex items-start gap-3">
          <div className="w-37">
            <label className="mb-1 flex h-8 items-end font-[Arial,sans-serif] text-[0.75rem] leading-tight text-black">
              * Range Start (Last Initial)
            </label>
            <input
              type="text"
              maxLength={1}
              value={start}
              onChange={(e) => setStart(e.target.value.toUpperCase())}
              className="h-8 w-full rounded-sm border border-[#d1d5db] bg-white px-2.5 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
            />
            {errors.start && <ValidationError message={errors.start} />}
          </div>

          <div className="mt-9 flex h-8 w-8 items-center justify-center self-start font-[Arial,sans-serif] text-[0.75rem] text-black">
            TO
          </div>

          <div className="w-37">
            <label className="mb-1 flex h-8 items-end font-[Arial,sans-serif] text-[0.75rem] leading-tight text-black">
              * Range End (Last Initial)
            </label>
            <input
              type="text"
              maxLength={1}
              value={end}
              onChange={(e) => setEnd(e.target.value.toUpperCase())}
              className="h-8 w-full rounded-sm border border-[#d1d5db] bg-white px-2.5 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
            />
            {errors.end && <ValidationError message={errors.end} />}
          </div>

          <div className="mt-9 flex h-8 w-10 items-center justify-center self-start">
            <Image
              src="/images/arrow-forward.svg"
              alt=""
              width={20}
              height={20}
            />
          </div>

          <div className="w-56">
            <label className="mb-1 flex h-8 items-end font-[Arial,sans-serif] text-[0.75rem] leading-tight text-black">
              * Assigned Advisor
            </label>
            <Dropdown
              value={advisorId}
              onChange={setAdvisorId}
              placeholder="Advisor ID"
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
            {errors.advisorId && <ValidationError message={errors.advisorId} />}
          </div>

          <div className="w-16">
            <label className="mb-1 flex h-8 items-end font-[Arial,sans-serif] text-[0.75rem] leading-tight text-black">
              * Priority
            </label>
            <input
              type="text"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="h-8 w-full rounded-sm border border-[#d1d5db] bg-white px-2.5 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
            />
            {errors.priority && <ValidationError message={errors.priority} />}
          </div>
        </div>
        <div className="mt-2 flex justify-end">
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
  );
}
