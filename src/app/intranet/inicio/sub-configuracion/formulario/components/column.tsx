//\intranet\inicio\sub-configuracion\formulario\components\column.tsx 
"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Data } from "../data/schema";
import { DataTableColumnHeader } from "../components/data-table-column-header";
import { DataTableRowActions } from "../components/data-table-row-actions";
import { useState } from "react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Para formatear en español
import { toast,Toaster } from "sonner" // Importa la función toast de sonner
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<Data>[] = [
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
    accessorKey: "idf",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="id"/>
    ),
    cell: ({ row }) => <div className="w-[80px]">{
      //row.getValue("idf")
      row.index + 1
      }</div>,
    enableSorting: true,
    enableHiding: true,
    meta: { label: "id" },
  },
  {
    accessorKey: "nmForm",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("nmForm")}
          </span>
        </div>
      )
    },
    meta: { label: "nombre" },
  },
  {
    accessorKey: "abre",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Abreviatura" />
    ),
    cell: ({ row }) => {
      
  
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("abre")}
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
      const estado = row.getValue<boolean>("estado"); // Obtén el valor booleano de "estado"
      const [data, setData] = useState<Data[]>(table.options.data); // Add state for data

      const handleChange = async () => {
        if (isUpdating) return;
        
        const nuevoEstado = !estado;
        const estadoAnterior = data.find(f => f.idf === row.original.idf)?.estado;
        const formularioActivo = data.find(f => f.estado);

        try {
          setIsUpdating(true);
          const newData = data.map(form => {
            if (form.idf === row.original.idf) {
              return { ...form, estado: nuevoEstado ?? false };
            }
            if (form.idf === formularioActivo?.idf) {
              return { ...form, estado: false };
            }
            return form;
          });
          setData(newData);
          table.options.data = newData;
          
          // @ts-ignore - La función viene del componente padre
          if (table.options.meta?.onEstadoChange) {
            // @ts-ignore
            const response = await table.options.meta.onEstadoChange(
              row.original.idf,
              nuevoEstado
            );
            if(!response) {
              throw new Error('Error al actualizar el estado');
            }
            toast.success("Estado 1 actualizado correctamente", {
              description: `${row.getValue<string>("nmForm")} ahora está ${
                nuevoEstado ? "activo" : "inactivo"
              }`,
            });
          }
        } catch(error) {
          // 4. Revertir cambios en caso de error
          const restoredData = data.map(form => {
            if (form.idf === row.original.idf) {
              return { ...form, estado: estadoAnterior ?? false };
            }
            if (form.idf === formularioActivo?.idf) {
              return { ...form, estado: true };
            }
            return form;
          });
          
          setData(restoredData);
          table.options.data = restoredData;
          table.setOptions(prev => ({ ...prev }));
  
          toast.error("Error 2 al actualizar el estado", {
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
            type="radio"
            name={`estado-group`}
            checked={estado}
            onChange={handleChange}
            className={`form-radio h-4 w-4`}
            
          />
      </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: { label: "Estado" },
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
