"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { estados } from "../data/data"
import { ProjectSchema } from "../data/schema"
import { Badge } from "@/components/ui/badge"
import { boolean } from "zod"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const project = ProjectSchema.parse(row.original)
  let tienePermisos: boolean;
  tienePermisos = true;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>Editar proyecto</DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/intranet/inicio/planificacion/ver-proyecto/${(row.original as any).idproj}`}>
            Ver proyecto
          </Link> 
          </DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>
        {tienePermisos && <DropdownMenuSeparator />}
        {tienePermisos && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={project.estado}>
                {estados.map((label) => (
                  <DropdownMenuRadioItem key={label.value} value={label.value}>
                    <Badge
                      className={`${label.color} ${label.borderColor} border ${label.textColor} uppercase pointer-events-none`}
                    >
                      {label.icon && <label.icon className="mr-2 h-4 w-4" />}
                      {label.label}
                    </Badge>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}