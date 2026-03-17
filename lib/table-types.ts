export interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
}

export interface TableRowData {
    id: string;
    [key: string]: string | number | boolean | undefined;
}

export interface TablePagination {
    currentPage: number;
    totalPages: number;
    perPage: number;
    totalResults: number;
}

export type StatusVariant = 'published' | 'error' | 'draft' | 'pending';
