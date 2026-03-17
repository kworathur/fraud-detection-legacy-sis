'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type {
    TableColumn,
    TableRowData,
    TablePagination,
    StatusVariant,
} from '@/lib/table-types';

const statusStyles: Record<
    StatusVariant,
    { border: string; text: string; label: string }
> = {
    published: {
        border: 'border-[#16a34a]',
        text: 'text-[#10b981]',
        label: 'PUBLISHED',
    },
    error: {
        border: 'border-[#b91c1c]',
        text: 'text-[#b91c1c]',
        label: 'ERROR',
    },
    draft: {
        border: 'border-[#6b7280]',
        text: 'text-[#6b7280]',
        label: 'DRAFT',
    },
    pending: {
        border: 'border-[#ca8a04]',
        text: 'text-[#ca8a04]',
        label: 'PENDING',
    },
};

function StatusBadge({ status }: Readonly<{ status: string }>) {
    const s = statusStyles[status as StatusVariant];
    if (!s) {
        return (
            <span className="font-[family-name:Arial,sans-serif] text-[0.5rem] text-[#6b7280]">
                {status}
            </span>
        );
    }
    return (
        <div
            className={`inline-flex h-[0.9375rem] items-center justify-center rounded-[0.25rem] border-[1.5px] ${s.border} px-[0.4375rem] py-[0.25rem]`}
        >
            <span
                className={`font-[family-name:Arial,sans-serif] text-[0.5rem] ${s.text}`}
            >
                {s.label}
            </span>
        </div>
    );
}

export function TableHeader({
    columns,
    showCheckbox = true,
    allSelected = false,
    partiallySelected = false,
    onToggleAll,
}: Readonly<{
    columns: TableColumn[];
    showCheckbox?: boolean;
    allSelected?: boolean;
    partiallySelected?: boolean;
    onToggleAll?: () => void;
}>) {
    const selectAllRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate =
                partiallySelected && !allSelected;
        }
    }, [allSelected, partiallySelected]);

    return (
        <div className="flex h-12.25 items-center gap-1 border-b border-[#d1d5db] px-3.5">
            {showCheckbox && (
                <input
                    ref={selectAllRef}
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={allSelected}
                    onChange={() => onToggleAll?.()}
                    className="h-3.75 w-3.75 shrink-0 cursor-pointer rounded-sm border-2 border-[#6b7280] accent-[#0ea5e9]"
                />
            )}
            {columns.map((col) => (
                <div
                    key={col.key}
                    className={`flex items-center ml-2 gap-1 ${
                        col.align === 'center'
                            ? 'justify-center'
                            : col.align === 'right'
                              ? 'justify-end'
                              : 'justify-start'
                    }`}
                    style={{ width: col.width }}
                >
                    <span className="font-[Arial,sans-serif] text-[0.625rem] font-bold text-black">
                        {col.label}
                    </span>
                    {col.sortable && (
                        <Image
                            src="/images/arrow-up.svg"
                            alt="Sort"
                            width={20}
                            height={20}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export function TableRow({
    row,
    columns,
    showCheckbox = true,
    isSelected = false,
    onToggle,
}: Readonly<{
    row: TableRowData;
    columns: TableColumn[];
    showCheckbox?: boolean;
    isSelected?: boolean;
    onToggle?: () => void;
}>) {
    return (
        <div data-meeting-id={row.id} className="flex h-12.25 items-center gap-1 border-b border-[#d1d5db] px-3.5">
            {showCheckbox && (
                <input
                    type="checkbox"
                    aria-label={`Select row ${row.id}`}
                    checked={isSelected}
                    onChange={() => onToggle?.()}
                    className="h-3.75 w-3.75 shrink-0 cursor-pointer rounded-sm border-2 border-[#6b7280] accent-[#0ea5e9]"
                />
            )}
            {columns.map((col) => (
                <div
                    key={col.key}
                    className={`flex ml-2 items-center ${
                        col.align === 'center'
                            ? 'justify-center'
                            : col.align === 'right'
                              ? 'justify-end'
                              : 'justify-start'
                    }`}
                    style={{ width: col.width }}
                >
                    {col.key === 'pipeline' ? (
                        <a
                            href="#"
                            className="font-[Arial,sans-serif] text-[0.625rem] font-bold text-[#0ea5e9] underline"
                        >
                            {String(row[col.key] ?? '')}
                        </a>
                    ) : col.key === 'status' ? (
                        <StatusBadge
                            status={
                                String(row[col.key] ?? 'draft') as StatusVariant
                            }
                        />
                    ) : col.key === 'draft' ? (
                        <div className="flex items-center justify-center">
                            <Image
                                src="/images/info-icon.svg"
                                alt="Info"
                                width={16}
                                height={16}
                            />
                        </div>
                    ) : col.key === 'actions' ? (
                        <div className="flex items-center">
                            <button type="button">
                                <Image
                                    src="/images/more-vert.svg"
                                    alt="Actions"
                                    width={3}
                                    height={11}
                                />
                            </button>
                        </div>
                    ) : col.key === 'filters' ? (
                        <span className="font-[Inconsolata,monospace] text-[0.625rem] text-black">
                            {String(row[col.key] ?? '')}
                        </span>
                    ) : col.key === 'lastUpdated' ? (
                        <span className="font-[Arial,sans-serif] text-[0.625rem] text-[#4b5563]">
                            {String(row[col.key] ?? '')}
                        </span>
                    ) : (
                        <span className="font-[Arial,sans-serif] text-[0.625rem] text-black">
                            {String(row[col.key] ?? '')}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}

export function TablePaginationBar({
    pagination,
    onPageChange,
    onPerPageChange,
}: Readonly<{
    pagination: TablePagination;
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
}>) {
    const perPageOptions = [10, 25, 50, 100];

    return (
        <div className="flex items-center justify-between px-3.5 py-2">
            <div className="flex items-end gap-4.75">
                <span className="font-[Arial,sans-serif] text-[0.625rem] font-bold text-[#525252]">
                    Per page:
                </span>
                <div className="relative">
                    <select
                        aria-label="Rows per page"
                        value={pagination.perPage}
                        onChange={(event) =>
                            onPerPageChange?.(Number(event.target.value))
                        }
                        disabled={!onPerPageChange}
                        className="h-4.5 appearance-none border-0 bg-transparent pr-3.5 font-[Arial,sans-serif] text-[0.625rem] font-bold text-[#525252] outline-none disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {perPageOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <Image
                        src="/images/chevron-down.svg"
                        alt=""
                        width={10}
                        height={6}
                        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
                    />
                </div>
                <span className="font-[Arial,sans-serif] text-[0.625rem] font-bold text-[#525252]">
                    Total results: {pagination.totalResults}
                </span>
            </div>
            <div className="flex items-center gap-9.5">
                <button
                    type="button"
                    onClick={() => onPageChange?.(1)}
                    aria-label="First page"
                >
                    <Image
                        src="/images/skip-back.svg"
                        alt=""
                        width={20}
                        height={20}
                    />
                </button>
                <button
                    type="button"
                    onClick={() =>
                        onPageChange?.(Math.max(1, pagination.currentPage - 1))
                    }
                    aria-label="Previous page"
                >
                    <Image
                        src="/images/chevron-left.svg"
                        alt=""
                        width={20}
                        height={20}
                    />
                </button>
                <div className="flex items-center gap-1.25">
                    <span className="font-[Arial,sans-serif] text-[0.625rem] font-bold text-[#4b5563]">
                        Page
                    </span>
                    <div className="flex h-4.75 w-7.5 items-center justify-center rounded-sm border border-[#a3a3a3]">
                        <span className="font-[Arial,sans-serif] text-[0.625rem] font-bold text-[#525252]">
                            {pagination.currentPage}
                        </span>
                    </div>
                    <span className="font-[Arial,sans-serif] text-[0.625rem] font-bold text-[#404040]">
                        of {pagination.totalPages}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() =>
                        onPageChange?.(
                            Math.min(
                                pagination.totalPages,
                                pagination.currentPage + 1
                            )
                        )
                    }
                    aria-label="Next page"
                >
                    <Image
                        src="/images/chevron-right.svg"
                        alt=""
                        width={20}
                        height={20}
                    />
                </button>
                <button
                    type="button"
                    onClick={() => onPageChange?.(pagination.totalPages)}
                    aria-label="Last page"
                >
                    <Image
                        src="/images/skip-forward.svg"
                        alt=""
                        width={20}
                        height={20}
                    />
                </button>
            </div>
        </div>
    );
}

export default function Table({
    columns,
    rows,
    pagination,
    showCheckbox = true,
    onPageChange,
    onPerPageChange,
    onSelectionChange,
}: Readonly<{
    columns: TableColumn[];
    rows: TableRowData[];
    pagination?: TablePagination;
    showCheckbox?: boolean;
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
    onSelectionChange?: (selectedRowIds: string[]) => void;
}>) {
    const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(
        new Set()
    );
    const onSelectionChangeRef = useRef(onSelectionChange);

    useEffect(() => {
        onSelectionChangeRef.current = onSelectionChange;
    }, [onSelectionChange]);

    useEffect(() => {
        onSelectionChangeRef.current?.(Array.from(selectedRowIds));
    }, [selectedRowIds]);

    const allSelected =
        rows.length > 0 && rows.every((row) => selectedRowIds.has(row.id));
    const partiallySelected =
        rows.some((row) => selectedRowIds.has(row.id)) && !allSelected;

    function toggleAllRows() {
        setSelectedRowIds((current) => {
            if (rows.length === 0) {
                return current;
            }
            if (allSelected) {
                const next = new Set(current);
                rows.forEach((row) => next.delete(row.id));
                return next;
            }
            const next = new Set(current);
            rows.forEach((row) => next.add(row.id));
            return next;
        });
    }

    function toggleRow(rowId: string) {
        setSelectedRowIds((current) => {
            const next = new Set(current);
            if (next.has(rowId)) {
                next.delete(rowId);
            } else {
                next.add(rowId);
            }
            return next;
        });
    }

    return (
        <div className="flex w-full flex-col gap-1">
            <TableHeader
                columns={columns}
                showCheckbox={showCheckbox}
                allSelected={allSelected}
                partiallySelected={partiallySelected}
                onToggleAll={toggleAllRows}
            />
            {rows.length === 0 ? (
                <div className="flex h-12.25 items-center justify-center border-b border-[#d1d5db] px-3.5">
                    <span className="font-[Arial,sans-serif] text-[0.625rem] text-[#6b7280]">
                        No rows to display
                    </span>
                </div>
            ) : (
                rows.map((row) => (
                    <TableRow
                        key={row.id}
                        row={row}
                        columns={columns}
                        showCheckbox={showCheckbox}
                        isSelected={selectedRowIds.has(row.id)}
                        onToggle={() => toggleRow(row.id)}
                    />
                ))
            )}
            {pagination && (
                <TablePaginationBar
                    pagination={pagination}
                    onPageChange={onPageChange}
                    onPerPageChange={onPerPageChange}
                />
            )}
        </div>
    );
}
