"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { estados } from "../data/data"
import { Project } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "../components/data-table-row-actions"

import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Para formatear en español

export const columns: ColumnDef<Project>[] = [
  /*{
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },*/
  {
    accessorKey: "idproj",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="id"/>
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("idproj")}</div>,
    enableSorting: true,
    enableHiding: true,
    meta: { label: "id" },
  },
  {
    accessorKey: "idString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("idString")}
          </span>
        </div>
      )
    },
    meta: { label: "nombre" },
  },
  {
    accessorKey: "estado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = estados.find(
        (status) => status.value === row.getValue("estado")
      );
  
      if (!status) {
        return null;
      }
  
      return (
        <div className="flex w-[150px] items-center">
          <Badge className={`${status.color} ${status.borderColor} border ${status.textColor} uppercase pointer-events-none`}>
            {status.icon && (
              <status.icon className="mr-2 h-4 w-4" />
            )}
            <span>{status.label}</span>
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "fInit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Inicio" />
    ),
    cell: ({ row }) => {
        const fecha = row.getValue<string>("createdAt"); // Especifica el tipo como string
        const fechaFormateada = format(new Date(fecha), "d 'de' MMMM 'de' yyyy", { locale: es });
        
      return (
        <div className="flex items-center">
          <span>{fechaFormateada}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    meta: { label: "Fecha inicio" },
  },
  {
    accessorKey: "fFin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha final" />
    ),
    cell: ({ row }) => {
        const fecha = row.getValue<string>("createdAt"); // Especifica el tipo como string
        const fechaFormateada = format(new Date(fecha), "dd/MM/yyyy", { locale: es });
        
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {fechaFormateada}
          </span>
        </div>
      )
    },
    meta: { label: "Fecha Fin" },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de creación" />
    ),
    cell: ({ row }) => {
      const fecha = row.getValue<string>("createdAt"); // Especifica el tipo como string
      const fechaFormateada = format(new Date(fecha), "dd/MM/yyyy", { locale: es });
      return (
        <div className="flex items-center">
          
          <span>{fechaFormateada}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    meta: { label: "Fecha de creacion" }, // Usar meta para agregar label
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de actualización" />
    ),
    cell: ({ row }) => {
      const fecha = row.getValue<string>("createdAt"); // Especifica el tipo como string
      const fechaFormateada = format(new Date(fecha), "dd/MM/yyyy", { locale: es });
      
      return (
        <div className="flex items-center">
          
          <span>{fechaFormateada}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    meta: { label: "Fecha de actualización" }, // Usar meta para agregar label
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
