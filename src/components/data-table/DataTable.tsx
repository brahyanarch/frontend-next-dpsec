// components/data-table/DataTable.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  ChevronsUpDown,
  SearchIcon,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataTableProps, ColumnDef } from './types';
import { DataTablePagination } from './DataTablePagination';
import { DataTableViewOptions } from './DataTableViewOptions';

export function DataTable<T>({
  data,
  columns,
  totalCount,
  pageSize = 10,
  pageIndex = 0,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onSearch,
  onFilterChange,
  searchValue = '',
  filters = {},
  sort,
  rowActions,
  isLoading = false
}: DataTableProps<T>) {
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    columns.reduce((acc, col) => ({ ...acc, [col.key as string]: col.visible ?? true }), {})
  );

  const [localSearch, setLocalSearch] = useState(searchValue);

  // Columnas visibles
  const visibleColumns = useMemo(() => {
    return columns.filter(col => columnVisibility[col.key as string] !== false);
  }, [columns, columnVisibility]);

  // Manejar búsqueda
  const handleSearch = (value: string) => {
    setLocalSearch(value);
    // Debounce podría ser implementado aquí
    onSearch?.(value);
  };

  // Manejar ordenamiento
  const handleSort = (key: string) => {
    if (!onSortChange) return;
    
    const newDirection = sort?.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ key, direction: newDirection });
  };

  // Renderizar header de columna con ordenamiento
  const renderColumnHeader = (column: ColumnDef<T>) => {
    if (!column.sortable) {
      return column.header;
    }

    const isSorted = sort?.key === column.key;
    const SortIcon = isSorted 
      ? sort.direction === 'asc' 
        ? ChevronUpIcon 
        : ChevronDownIcon
      : ChevronsUpDown;

    return (
      <Button
        variant="ghost"
        onClick={() => handleSort(column.key as string)}
        className="flex items-center gap-1 p-0 h-auto font-semibold hover:bg-transparent"
      >
        {column.header}
        <SortIcon className={`h-4 w-4 ${isSorted ? 'text-primary' : 'text-muted-foreground'}`} />
      </Button>
    );
  };

  // Renderizar celda
  const renderCell = (row: T, column: ColumnDef<T>) => {
    const value = column.accessorKey 
      ? (row as any)[column.accessorKey as string]
      : (row as any)[column.key as string];

    if (column.cell) {
      return column.cell(value, row);
    }

    return value;
  };

  return (
    <div className="space-y-4">
      {/* Barra de herramientas */}
      <div className="flex items-center justify-between">
        {/* Búsqueda */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-80">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar..."
              value={localSearch}
              onChange={(e) => {setLocalSearch(e.target.value);handleSearch(e.target.value);}}
              className="pl-10"
            />
          </div>
          
          {/* Filtros por estado (ejemplo) */}
          {filters && Object.keys(filters).length > 0 && (
            <div className="flex items-center gap-2">
              {Object.entries(filters).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="flex items-center gap-1">
                  {key}: {value}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => onFilterChange?.({ ...filters, [key]: undefined })}
                  >
                    <X />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Configuración de vista */}
        <DataTableViewOptions
          columns={columns}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
        />
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead key={column.key as string}>
                  {renderColumnHeader(column)}
                </TableHead>
              ))}
              {rowActions && <TableHead className="w-24">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state
              <TableRow>
                <TableCell colSpan={visibleColumns.length + (rowActions ? 1 : 0)} className="h-24 text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={visibleColumns.length + (rowActions ? 1 : 0)} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            ) : (
              // Datos
              data.map((row, index) => (
                <TableRow key={index}>
                  {visibleColumns.map((column) => (
                    <TableCell key={column.key as string} className='max-w-[150px] truncate lg:truncate-none'>
                      {renderCell(row, column)}
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell>
                      {rowActions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <DataTablePagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={onPageChange ?? (() => {})}
        onPageSizeChange={onPageSizeChange ?? (() => {})}
      />
    </div>
  );
}