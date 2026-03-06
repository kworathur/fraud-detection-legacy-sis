"use client";

import { useCallback, useEffect, useState } from "react";
import Table from "@/components/ui/Table";
import { quaidApiRequest } from "@/lib/quaid-api-client";
import type { StudentRecord } from "@/lib/quaid-api-types";
import type {
  TableColumn,
  TableRowData,
  TablePagination,
} from "@/lib/table-types";

type AdvisorStudentsResponse = {
  data: StudentRecord[];
};

const TABLE_COLUMNS: TableColumn[] = [
  { key: "name", label: "Name", width: "16rem" },
  { key: "email", label: "Email", width: "14rem" },
  { key: "level", label: "Level of Study", width: "8rem" },
  { key: "status", label: "Status", width: "8rem" },
];

export default function AdvisingHomePage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await quaidApiRequest<AdvisorStudentsResponse>(
        "advising/students",
      );
      setStudents(response.data);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load students",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  const rows: TableRowData[] = students.map((student) => ({
    id: String(student.id),
    name: student.name,
    email: student.email,
    level: student.level_of_study,
    status: student.verificationStatus,
  }));

  const pagination: TablePagination = {
    currentPage: 1,
    totalPages: Math.max(1, Math.ceil(students.length / 10)),
    perPage: 10,
    totalResults: students.length,
  };

  return (
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
        <p className="font-[Arial,sans-serif] text-[0.625rem] text-[#404040]">
          List of all students currently assigned to you.
        </p>

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
