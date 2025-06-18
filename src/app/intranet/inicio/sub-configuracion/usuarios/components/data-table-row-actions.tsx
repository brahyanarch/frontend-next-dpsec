// components/user-row-actions.tsx
"use client"

import { Row, Table } from "@tanstack/react-table"
import { useState } from "react"
import { MoreHorizontal, Power } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Data } from "../data/schema"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { AuthService } from "@/services/api/auth.service"

interface TableMeta<TData = unknown> {
  setData: React.Dispatch<React.SetStateAction<TData[]>>;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  table: Table<TData>
}

export function DataTableRowActions<TData>({
  row,
  table
}: DataTableRowActionsProps<TData>) {
  const user = row.original as Data
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (nuevoEstado: boolean) => {
    if (isUpdating) return;
    
    const estadoAnterior = user.estado;
    const table = row.options?.meta?.table;
    
    if (!table) {
      console.error("Table reference is missing");
      return;
    }
    
    const onDataChange = table.options.meta?.onDataChange;
    
    if (!onDataChange) {
      console.error("onDataChange function is missing");
      return;
    }
    
    try {
      setIsUpdating(true);
      
      // 1. Actualización optimista
      const currentData = table.options.data as Data[];
      const newData = currentData.map(u => 
        u.iduser === user.iduser ? { ...u, estado: nuevoEstado } : u
      );
      
      onDataChange(newData); // Actualiza los datos padre
      
      // 2. Llamada a la API
      const success = await AuthService.updateUserStatus(user.iduser, nuevoEstado);
      
      if (!success) throw new Error("API update failed");
      
      toast.success(`Usuario ${nuevoEstado ? "activado" : "desactivado"}`, {
        description: `El estado de ${user.datausuario.nombre} se actualizó correctamente`,
      });
    } catch (error) {
      // Revertir cambios
      const currentData = table.options.data as Data[];
      const restoredData = currentData.map(u => 
        u.iduser === user.iduser ? { ...u, estado: estadoAnterior } : u
      );
      
      onDataChange(restoredData);
      
      toast.error("Error al actualizar el estado", {
        description: "El estado se ha revertido al valor anterior",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <div className="flex items-center justify-between px-2 py-1.5 text-sm">
          <span>Estado:</span>
          <Switch
            checked={user.estado}
            onCheckedChange={(checked) => { handleStatusChange(checked); }}
            disabled={isUpdating}
          />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Editar usuario</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}