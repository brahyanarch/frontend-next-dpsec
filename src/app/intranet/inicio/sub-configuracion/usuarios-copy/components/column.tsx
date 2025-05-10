//\intranet\inicio\sub-configuracion\usuarios\components\column.tsx 
"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Data } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { useState } from "react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Para formatear en español
import { toast,Toaster } from "sonner" // Importa la función toast de sonner
import { Button } from "@/components/ui/button"
import {estado} from '../data/data'
import {Badge} from "@/components/ui/badge"

export const columns: ColumnDef<Data>[] = [
  {
    accessorKey: "iduser",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="id"/>
    ),
    cell: ( { row }) => 
      <div className="w-[0px]">
        {row.index + 1}
      </div>,
    enableSorting: true,
    enableHiding: false,
    meta: { label: "id" },
  },
  {
    accessorKey: "nombre",
    accessorFn: (row) => `${row.datausuario.APaterno} ${row.datausuario.AMaterno} ${row.datausuario.nombre}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[160px] truncate font-medium">
            {`${user.datausuario.APaterno} ${user.datausuario.AMaterno} ${user.datausuario.nombre}`}
          </span>
        </div>
      )
    },
    meta: { label: "nombre" },
    filterFn: "includesString",
  },
  {
    accessorKey: "dni",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DNI" />
    ),
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex space-x-2">
          <span className="max-w-[70px] truncate font-medium">
            {`${user.datausuario.dni}`}
          </span>
        </div>
      )
    
    },
    meta: { label: "dni" },
    filterFn: "includesString"
  },
  {
    accessorKey: "rol",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rol" />
    ),
    cell: ({ row }) => {
      const subunidad = row.original;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {subunidad.roles.n_rol}
          </span>
        </div>
      );
    },
    meta: { label: "rol" },
    filterFn: "includesString"
  },
  {
    accessorKey: "subunidad",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub unidad" />
    ),
    cell: ({ row }) => {
      const subunidad = row.original.subunidad;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {subunidad.n_subuni}
          </span>
        </div>
      );
    },
    filterFn: "includesString",
    meta: { label: "Sub unidad" },
  },
  {
    accessorKey: "estado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = estado.find(
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
  // ================= columnas por default =================
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de creación" />
    ),
    cell: ({ row }) => {
      const fecha = row.getValue<string>("createdAt"); // Especifica el tipo como string

      const fechaFormateada = format(new Date(fecha), "dd/MM/yyyy", { locale: es }); // Formatea la fecha
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
      const fecha = row.getValue<string>("updatedAt"); // Especifica el tipo como string
      
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
