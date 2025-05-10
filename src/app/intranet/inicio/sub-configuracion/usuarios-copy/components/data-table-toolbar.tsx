// intranet\inicio\sub-configuracion\formulario\components\data-table-toolbar.tsx
"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "../components/data-table-view-options";

import { estado } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar..."
          value={(table.getColumn("nombre")?.getFilterValue() as string) || ""}
          onChange={(event) => {
            // Forzar búsqueda en minúsculas y sin espacios
            const value = event.target.value.toLowerCase().trim();
            table.getColumn("nombre")?.setFilterValue(value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("estado") && (
          <DataTableFacetedFilter
            column={table.getColumn("estado")}
            title="Estado"
            options={estado}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Resetear
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
