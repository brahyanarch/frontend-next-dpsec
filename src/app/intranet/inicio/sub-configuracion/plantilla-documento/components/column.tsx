//\intranet\inicio\sub-configuracion\formulario\components\column.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Document } from "../data/schema";
import { DataTableColumnHeader } from "../components/data-table-column-header";
import { DataTableRowActions } from "../components/data-table-row-actions";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Para formatear en español
import { toast, Toaster } from "sonner"; // Importa la función toast de sonner
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Document>[] = [
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
    accessorKey: "idplantilladoc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="id" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {
          row.index + 1
        }
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
    meta: { label: "id" },
  },
  {
    accessorKey: "nombre",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("nombre")}
          </span>
        </div>
      );
    },
    meta: { label: "nombre" },
  },
  {
    accessorKey: "descripcion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripcion" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("descripcion") || "Sin descripción"}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "estado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row, table }) => {
      const [isUpdating, setIsUpdating] = useState(false);
      const estado = row.getValue<boolean>("estado");
      const [data, setData] = useState<Document[]>(table.options.data);

      const handleChange = async () => {
        if (isUpdating) return;

        const nuevoEstado = !estado;
        const estadoAnterior = data.find(
          (d) => d.idplantilladoc === row.original.idplantilladoc
        )?.estado;

        try {
          setIsUpdating(true);

          // ✅ Solo actualiza este documento
          const newData = data.map((doc) =>
            doc.idplantilladoc === row.original.idplantilladoc ? { ...doc, estado: nuevoEstado } : doc
          );

          setData(newData);
          table.options.data = newData;

          // 🔁 Llamada al método del componente padre (para actualizar backend)
          // @ts-ignore
          if (table.options.meta?.onEstadoChange) {
            // @ts-ignore
            const response = await table.options.meta.onEstadoChange(
              row.original.idplantilladoc,
              nuevoEstado
            );
            if (!response) throw new Error("Error al actualizar el estado");

            toast.success("Estado actualizado correctamente", {
              description: `${row.getValue<string>(
                "nombreDocumento"
              )} ahora está ${nuevoEstado ? "activo" : "inactivo"}`,
            });
          }
        } catch (error) {
          // 🔙 Revertir en caso de error
          const restoredData = data.map((doc) =>
            doc.idplantilladoc === row.original.idplantilladoc
              ? { ...doc, estado: estadoAnterior ?? false }
              : doc
          );

          setData(restoredData);
          table.options.data = restoredData;
          table.setOptions((prev) => ({ ...prev }));

          toast.error("Error al actualizar el estado", {
            description: "El estado se ha revertido al valor anterior.",
          });
        } finally {
          setIsUpdating(false);
        }
      };

      return (
        <div className="flex items-center">
          <Toaster position="bottom-right" />
          <Input
            type="checkbox"
            checked={estado}
            onChange={handleChange}
            className="h-4 w-4"
          />
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: { label: "Estado" },
  }, // ================= columnas por default =================
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de creación" />
    ),
    cell: ({ row }) => {
      const fecha = row.getValue<string>("createdAt"); // Especifica el tipo como string

      const fechaFormateada = format(new Date(fecha), "dd/MM/yyyy", {
        locale: es,
      }); // Formatea la fecha
      return (
        <div className="flex items-center">
          <span>{fechaFormateada}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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

      const fechaFormateada = format(new Date(fecha), "dd/MM/yyyy", {
        locale: es,
      });

      return (
        <div className="flex items-center">
          <span>{fechaFormateada}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: { label: "Fecha de actualización" }, // Usar meta para agregar label
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
