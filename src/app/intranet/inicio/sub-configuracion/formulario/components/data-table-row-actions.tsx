//intranet\inicio\sub-configuracion\formulario\components\data-table-row-actions.tsx
"use client"

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"


import Link from "next/link";
import { FormularioService } from '@/services/api/formulario.service'

//import { labels } from "../data/dataPE"
import { Data, DataSchema } from "../data/schema"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onFormCopied?: () => void
}

export function DataTableRowActions<TData>({
  row,
  onFormCopied
}: DataTableRowActionsProps<TData>) {
  //console.log("Datos de la fila:", row.original);
  //const task = DataSchema.parse(row.original)
  const router = useRouter();
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    const formId = (row.original as any).idf
    const originalName = (row.original as any).nmForm
    
    try {
      setIsCopying(true)
      const newName = prompt(
        'Nombre de la copia:', 
        `Copia de ${originalName}`
      )

      if (!newName) return
      
      await FormularioService.copyForm(formId, newName)
      
      toast.success('Formulario copiado correctamente');
      window.location.reload();
      //router.push('/intranet/inicio/sub-configuracion/formulario?copiado=true');
      onFormCopied?.() // Actualizar la tabla si es necesario
    } catch (error) {
      toast.error('Error al copiar el formulario')
      console.error('Copy error:', error)
    } finally {
      setIsCopying(false)
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild>
          <Link href={`/intranet/inicio/sub-configuracion/formulario/editar-formulario/${(row.original as any).idf}`}>
            Editar formulario
          </Link> 
        </DropdownMenuItem>
        <CopyFormDialog
          formId={(row.original as any).idf}
          originalName={(row.original as any).nmForm}
          onSuccess={onFormCopied}
        />
          
            
        
        <DropdownMenuSeparator />
        
          <DeleteFormDialog 
          formId={(row.original as any).idf}
          onSuccess={onFormCopied}
        />
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        
      </DropdownMenuContent>
    </DropdownMenu>
  )
}



export function CopyFormDialog({ formId, originalName, onSuccess }: {
  formId: number
  originalName: string
  onSuccess?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [newName, setNewName] = useState(`Copia de ${originalName}`)
  const [isCopying, setIsCopying] = useState(false)

  const handleCopy = async () => {
    if (!newName.trim()) {
      toast.error("El nombre no puede estar vacío")
      return
    }

    try {
      setIsCopying(true)
      await FormularioService.copyForm(formId, newName)
      toast.success("Formulario copiado correctamente");
      if (onSuccess) onSuccess();

      window.location.reload();

      setIsOpen(false)
    } catch (error) {
      toast.error("Error al copiar el formulario")
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="default" className="w-full justify-start p-2 ">
          Hacer una copia
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Crear copia del formulario</AlertDialogTitle>
          <AlertDialogDescription>
            Ingrese un nuevo nombre para la copia del formulario
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 py-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCopy()}
            placeholder="Nombre de la copia"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleCopy}
            disabled={isCopying}
          >
            {isCopying ? "Copiando..." : "Continuar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


export function DeleteFormDialog({ formId, onSuccess }: {
  formId: number
  onSuccess?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await FormularioService.deleteForm(formId);
      toast.success("Formulario eliminado correctamente")
      // Aquí puedes llamar a la función onSuccess para actualizar la tabla o realizar otras acciones
      if (onSuccess) onSuccess();
      setIsOpen(false);
    } catch (error) {
      toast.error("Error al eliminar el formulario")
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50">
          Eliminar
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro de eliminar este formulario?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción es irreversible y eliminará permanentemente el formulario y todos sus datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}