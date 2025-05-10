// components/user-row-actions.tsx
"use client"

import { Row } from "@tanstack/react-table"
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

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const user = row.original as Data
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (nuevoEstado: boolean) => {
    if (isUpdating) return
    
    const estadoAnterior = user.estado
    const table = row.options.meta?.table
    const data = table.options.data
    
    try {
      setIsUpdating(true)
      // Actualización optimista
      const newData: Data[] = data.map((u: Data) => 
        u.iduser === user.iduser ? { ...u, estado: nuevoEstado } : u
      )
      
      table.options.meta?.setUsers(newData)
      
      // Llamar a la API
      if (table.options.meta?.onStatusChange) {
        const success = await table.options.meta.onStatusChange(
          user.iduser, 
          nuevoEstado
        )
        
        if (!success) throw new Error()
        
        toast.success(`Usuario ${nuevoEstado ? "activado" : "desactivado"}`, {
          description: `El estado de ${user.datausuario.nombre} se actualizó correctamente`,
        })
      }
    } catch (error) {
      // Revertir cambios
      const restoredData: Data[] = data.map((u: Data) => 
        u.iduser === user.iduser ? { ...u, estado: estadoAnterior } : u
      )
      
      table.options.meta?.setUsers(restoredData)
      toast.error("Error al actualizar el estado", {
        description: "El estado se ha revertido al valor anterior",
      })
    } finally {
      setIsUpdating(false)
    }
  }

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
            onCheckedChange={handleStatusChange}
            disabled={isUpdating}
          />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Editar usuario</DropdownMenuItem>
        <DropdownMenuItem>Cambiar contraseña</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}