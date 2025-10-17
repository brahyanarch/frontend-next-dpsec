// components/data-table/types.ts
export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  accessorKey?: keyof T | string;
  sortable?: boolean;
  visible?: boolean;
  cell?: (value: any, row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  totalCount: number;
  pageSize?: number;
  pageIndex?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortChange?: (sort: { key: string; direction: 'asc' | 'desc' }) => void;
  onSearch?: (search: string) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  searchValue?: string;
  filters?: Record<string, any>;
  sort?: { key: string; direction: 'asc' | 'desc' };
  rowActions?: (row: T) => React.ReactNode;
  isLoading?: boolean;
}

export interface DataTableState {
  pageIndex: number;
  pageSize: number;
  sort: { key: string; direction: 'asc' | 'desc' } | null;
  search: string;
  filters: Record<string, any>;
  columnVisibility: Record<string, boolean>;
}