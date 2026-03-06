"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { TableHeader, TableRow, TablePaginationBar } from "@/components/ui/Table";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import { quaidApiRequest } from "@/lib/quaid-api-client";
import type { StudentRecord, StudentListResponse } from "@/lib/quaid-api-types";
import type { TableColumn, TableRowData, TablePagination } from "@/lib/table-types";

const TEMPLATE_KEYS = [
  "CREDENTIALS_NEAR_COMPLETION",
  "SCHOLARSHIP_ELIGIBILITY",
  "SUGGESTED_COURSES",
  "UNDECLARED_CREDENTIALS",
];

type ResultRow = Record<string, string | number>;

type ExecuteResult = {
  columns: string[];
  rows: ResultRow[];
  elapsed: string;
  message?: string;
};

function InfoToast({ message }: Readonly<{ message: string }>) {
  return (
    <div className="flex items-center gap-2.5 rounded-sm border border-[#0284c7] bg-[#bae6fd] px-1.5 py-0.5">
      <span className="font-[Arial,sans-serif] text-[0.75rem] font-bold text-[#0284c7]">
        {message}
      </span>
      <Image src="/images/info-circle.svg" alt="" width={16} height={16} />
    </div>
  );
}

export default function PlaygroundPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [studentId, setStudentId] = useState("");
  const [templateKey, setTemplateKey] = useState("");
  const [filters, setFilters] = useState("");
  const [messageTemplate, setMessageTemplate] = useState("");
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ExecuteResult | null>(null);

  const loadStudents = useCallback(async () => {
    try {
      const response = await quaidApiRequest<StudentListResponse>(
        "students?offset=0&limit=60",
      );
      setStudents(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load students");
    }
  }, []);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  async function handleExecute() {
    if (!templateKey) return;

    setExecuting(true);
    setError("");
    try {
      const response = await quaidApiRequest<ExecuteResult>(
        "advising/insights/execute",
        {
          method: "POST",
          body: JSON.stringify({
            studentId: studentId ? Number(studentId) : undefined,
            templateKey,
            filters: filters
              .split("\n")
              .map((f) => f.trim())
              .filter(Boolean),
            messageTemplate,
          }),
        },
      );
      setResult(response);
    } catch (executeError) {
      setError(
        executeError instanceof Error
          ? executeError.message
          : "Failed to execute insight",
      );
    } finally {
      setExecuting(false);
    }
  }

  const resultColumns: TableColumn[] = result
    ? result.columns.map((col) => ({
        key: col,
        label: col,
      }))
    : [];

  const resultRows: TableRowData[] = result
    ? result.rows.map((row, i) => ({
        id: String(i),
        ...Object.fromEntries(Object.entries(row).map(([k, v]) => [k, String(v)])),
      }))
    : [];

  const pagination: TablePagination | undefined =
    resultRows.length > 0
      ? {
          currentPage: 1,
          totalPages: Math.max(1, Math.ceil(resultRows.length / 10)),
          perPage: 10,
          totalResults: resultRows.length,
        }
      : undefined;

  return (
    <div className="flex flex-1 gap-2.5 overflow-auto p-2">
      <div className="flex w-139 shrink-0 flex-col gap-6 rounded-sm bg-white p-2 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
        <h2 className="font-[Arial,sans-serif] text-[0.875rem] font-bold text-black">
          Advising Insight Playground
        </h2>

        <div className="flex flex-col gap-8.25">
          <div className="flex w-56 flex-col gap-2.5">
            <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
              Student
            </label>
            <Dropdown
              value={studentId}
              onChange={setStudentId}
              placeholder="-- Select Student --"
              options={students.map((student) => ({
                value: String(student.id),
                label: `${student.name} (${student.id})`,
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

          <div className="flex w-78.25 flex-col gap-2">
            <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
              Filters (Separate By Newline)
            </label>
            <textarea
              value={filters}
              onChange={(e) => setFilters(e.target.value)}
              className="h-17.5 w-full resize-none border border-[#d1d5db] bg-white p-1 font-[Arial,sans-serif] text-[0.75rem] text-black outline-none focus:border-[#3182ce]"
            />
          </div>

          <div className="flex w-78.25 flex-col gap-2">
            <label className="font-[Arial,sans-serif] text-[0.75rem] leading-none text-black">
              Message Template
            </label>
            <textarea
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              placeholder={`Hey {{student.first_name}}! You're only {{credits_rem}} credits left from completing a {{thread_name}} thread!`}
              className="h-12.75 w-full resize-none border border-[#e5e5e5] bg-white p-1 font-[Arial,sans-serif] text-[0.75rem] text-black placeholder:text-[#525252] outline-none focus:border-[#3182ce]"
            />
          </div>
        </div>

        {error && (
          <p className="font-[Arial,sans-serif] text-[0.75rem] text-alert-red">
            {error}
          </p>
        )}

        <div className="flex">
          <Button
            variant="secondary"
            onClick={() => void handleExecute()}
            disabled={executing}
          >
            {executing ? "EXECUTING..." : "EXECUTE INSIGHT"}
          </Button>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-6 rounded-sm bg-white p-2 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
        <h2 className="font-[Arial,sans-serif] text-[0.875rem] font-bold text-black">
          Live Results
        </h2>

        {result && result.message && <InfoToast message={result.message} />}

        {result && resultColumns.length > 0 ? (
          <div className="flex w-full flex-col gap-1">
            <TableHeader columns={resultColumns} showCheckbox={false} />
            {resultRows.length === 0 ? (
              <div className="flex h-12.25 items-center justify-center border-b border-[#d1d5db] px-3.5">
                <span className="font-[Arial,sans-serif] text-[0.625rem] text-[#6b7280]">
                  No rows to display
                </span>
              </div>
            ) : (
              resultRows.map((row) => (
                <TableRow
                  key={row.id}
                  row={row}
                  columns={resultColumns}
                  showCheckbox={false}
                />
              ))
            )}
            {pagination && <TablePaginationBar pagination={pagination} />}
          </div>
        ) : !result ? (
          <p className="font-[Arial,sans-serif] text-[0.75rem] text-[#6b7280]">
            Execute an insight to see results here.
          </p>
        ) : null}

        <h3 className="font-[Arial,sans-serif] text-[0.875rem] font-bold text-black">
          Advising Message Preview
        </h3>

        {result && messageTemplate ? (
          <p className="font-[Arial,sans-serif] text-[0.75rem] text-[#525252]">
            {messageTemplate}
          </p>
        ) : (
          <p className="font-[Arial,sans-serif] text-[0.75rem] text-[#6b7280]">
            Message preview will appear here after execution.
          </p>
        )}
      </div>
    </div>
  );
}
