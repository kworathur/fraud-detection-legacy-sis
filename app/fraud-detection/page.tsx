"use client";

import { useCallback, useEffect, useState } from "react";
import { SmallNav } from "@/components/layout/Navbar";
import { quaidApiRequest } from "@/lib/quaid-api-client";
import type {
  InquiryStartResponse,
  InquiryStatusResponse,
} from "@/lib/quaid-api-types";

const DEFAULT_STUDENT_ID = 1;

export default function FraudDetectionPage() {
  const [studentId, setStudentId] = useState(DEFAULT_STUDENT_ID);
  const [inquiryId, setInquiryId] = useState("");
  const [status, setStatus] = useState<InquiryStatusResponse["data"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startCheck = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await quaidApiRequest<InquiryStartResponse>(
        `students/${studentId}/checks/addressLiveness`,
        { method: "POST" },
      );
      setInquiryId(response.data.inquiryId);
    } catch (startError) {
      setError(
        startError instanceof Error
          ? startError.message
          : "Failed to start address liveness check",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadStatus = useCallback(async (id: string) => {
    if (!id) {
      return;
    }

    try {
      const response = await quaidApiRequest<InquiryStatusResponse>(
        `students/${studentId}/checks/${id}/status`,
      );
      setStatus(response.data);
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : "Failed to load check status",
      );
    }
  }, [studentId]);

  useEffect(() => {
    if (!inquiryId) {
      return;
    }

    void loadStatus(inquiryId);
  }, [inquiryId, loadStatus]);

  useEffect(() => {
    if (!inquiryId || !status) {
      return;
    }

    if (status.status !== "QUEUED" && status.status !== "IN_PROGRESS") {
      return;
    }

    const timer = window.setInterval(() => {
      void loadStatus(inquiryId);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [inquiryId, loadStatus, status]);

  return (
    <div className="min-h-screen w-full bg-white">
      <SmallNav />
      <main className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8">
        <h1 className="font-[Arial,sans-serif] text-3xl font-bold text-black">
          Fraud Detection
        </h1>
        <p className="font-[Arial,sans-serif] text-sm text-[#404040]">
          Start and monitor address-liveness checks.
        </p>

        <div className="flex flex-wrap items-end gap-2">
          <label className="text-sm text-[#404040]">
            Student ID
            <input
              type="number"
              min={1}
              value={studentId}
              onChange={(event) => setStudentId(Number(event.target.value || 1))}
              className="mt-1 h-9 w-28 border border-[#d1d5db] px-2"
            />
          </label>
          <button
            type="button"
            onClick={startCheck}
            disabled={loading}
            className="h-9 rounded bg-link-blue px-4 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading ? "Starting..." : "Start Check"}
          </button>
        </div>

        <label className="text-sm text-[#404040]">
          Inquiry ID
          <input
            value={inquiryId}
            onChange={(event) => setInquiryId(event.target.value)}
            placeholder="Paste inquiry UUID"
            className="mt-1 h-9 w-full border border-[#d1d5db] px-2"
          />
        </label>

        <div>
          <button
            type="button"
            onClick={() => void loadStatus(inquiryId)}
            disabled={!inquiryId}
            className="rounded border border-[#d1d5db] px-3 py-1.5 text-sm font-bold text-[#404040] disabled:opacity-40"
          >
            Refresh Status
          </button>
        </div>

        {error && (
          <p className="font-[Arial,sans-serif] text-sm text-alert-red">
            {error}
          </p>
        )}

        {status && (
          <section className="rounded border border-[#e5e7eb] p-4 text-sm text-[#111827]">
            <p>
              <strong>Status:</strong> {status.status}
            </p>
            <p>
              <strong>Created At:</strong> {status.createdAt}
            </p>
            {status.result && (
              <>
                <p>
                  <strong>Address Valid:</strong>{" "}
                  {status.result.addressValid ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Deliverability:</strong> {status.result.deliverability}
                </p>
              </>
            )}
            {status.errorMessage && (
              <p className="text-alert-red">
                <strong>Error:</strong> {status.errorMessage}
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
