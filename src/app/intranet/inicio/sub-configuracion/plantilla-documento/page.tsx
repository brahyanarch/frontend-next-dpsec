// app/documents/page.tsx - VERSIÓN CORREGIDA
"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { ColumnDef } from "@/components/data-table/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  EditIcon,
  MoreHorizontalIcon,
  TrashIcon,
  PlusIcon,
  Link,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DocumentosService,
  Document,
  GetDocumentsParams,
} from "@/services/api/documentos.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PermissionGuard } from "@/components/PermissionGuard";
// Definición de columnas
const DocumentColumns: ColumnDef<Document>[] = [
  {
    key: "idplantilladoc",
    header: "ID",
    accessorKey: "idplantilladoc",
    sortable: true,
    visible: true,
  },
  {
    key: "nombre",
    header: "Nombre",
    accessorKey: "nombre",
    sortable: true,
    visible: true,
  },
  {
    key: "descripcion",
    header: "Descripción",
    accessorKey: "descripcion",
    sortable: false,
    visible: true,
  },
  {
    key: "estado",
    header: "Estado",
    accessorKey: "estado",
    sortable: false,
    visible: true,
    cell: (value: boolean, row: Document) => (
      <EstadoCheckbox 
        estado={value} 
        documento={row} 
      />
    ),
  },
  {
    key: "createdAt",
    header: "Fecha Creación",
    accessorKey: "createdAt",
    sortable: true,
    visible: true,
    cell: (value: string) => new Date(value).toLocaleDateString("es-ES"),
  },
  {
    key: "updatedAt",
    header: "Última Actualización",
    accessorKey: "updatedAt",
    sortable: true,
    visible: false,
    cell: (value: string) => new Date(value).toLocaleDateString("es-ES"),
  },
];

// 🔄 Componente separado para el checkbox con estado interno
function EstadoCheckbox({ 
  estado, 
  documento 
}: { 
  estado: boolean; 
  documento: Document;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentEstado, setCurrentEstado] = useState(estado);

  const handleToggle = async () => {
    const newEstado = !currentEstado;
    
    // 1. Actualización optimista inmediata
    setCurrentEstado(newEstado);
    setIsUpdating(true);

    try {
      // 2. Llamada a la API
      await DocumentosService.toggleEstado(documento.idplantilladoc, newEstado);
      
      // 3. Éxito - Confirmar el cambio
      toast.success(`Documento ${newEstado ? "activado" : "desactivado"}`);
      
    } catch (error) {
      console.error("Error updating document state:", error);
      
      // 4. Error - Revertir el cambio
      setCurrentEstado(estado); // Volver al estado original
      toast.error("Error al actualizar el estado del documento");
      
    } finally {
      // 5. Siempre quitar el estado de "actualizando"
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <input
        type="checkbox"
        checked={currentEstado}
        onChange={handleToggle}
        disabled={isUpdating}
        className={`h-4 w-4 accent-green-600 cursor-pointer ${
          isUpdating ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />
      {isUpdating && (
        <span className="ml-2 text-xs text-muted-foreground">Actualizando...</span>
      )}
    </div>
  );
}

export default function DocumentPage() {
  const [data, setData] = useState<Document[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Función para cargar datos
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: GetDocumentsParams = {
        page: pageIndex + 1,
        limit: pageSize,
      };

      if (search) {
        params.search = search;
      }

      if (filters.estado) {
        params.estado = filters.estado;
      }

      if (sort) {
        params.sort = `${sort.key}:${sort.direction}`;
      }

      const response = await DocumentosService.getDocuments(params);
      setData(response.data);
      setTotalCount(response.pagination.totalCount);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("No se pudieron cargar los documentos");
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex, pageSize, search, filters, sort]);

  // Cargar datos cuando cambien los parámetros
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Acciones por fila
  const rowActions = (row: Document) => (
    
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleEdit(row)}
          className="flex items-center gap-2"
        >
          <EditIcon className="h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDelete(row.idplantilladoc)}
          className="flex items-center gap-2 text-red-600"
        >
          <TrashIcon className="h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Manejar edición
  const handleEdit = (item: Document) => {
    console.log("Editar documento:", item);
    toast.info(`Editando: ${item.nombre}`);
  };

  // Manejar eliminación
  const handleDelete = async (id: number) => {
    toast.warning("¿Estás seguro de que quieres eliminar este documento?", {
      action: {
        label: "Eliminar",
        onClick: async () => {
          try {
            await DocumentosService.deleteDocument(id);
            toast.success("El documento se eliminó correctamente");
            fetchData(); // Recargar datos
          } catch (error) {
            console.error("Error deleting document:", error);
            toast.error("No se pudo eliminar el documento");
          }
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {
          toast.info("Eliminación cancelada");
        }
      },
      duration: 10000,
    });
  };

  // Manejar creación
  const handleCreate = () => {
  
    // Redirigir a la nueva ruta
    router.push("/intranet/inicio/sub-configuracion/plantilla-documento/nuevo-documento");
  
    toast.info("Crear nuevo documento");
  };

  return (
    <PermissionGuard requiredPermission="VER_PLANILLA_DOCUMENTO">

    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Documentos</h1>
          <p className="text-muted-foreground">
            Administra y organiza tus documentos de manera eficiente.
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Nuevo documento
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        data={data}
        columns={DocumentColumns}
        totalCount={totalCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageIndex(0);
        }}
        onSortChange={setSort}
        onSearch={(value) => {
          setSearch(value);
          setPageIndex(0);
        }}
        onFilterChange={setFilters}
        searchValue={search}
        filters={filters}
        sort={sort || undefined}
        rowActions={rowActions}
        isLoading={isLoading}
      />
    </div>
    </PermissionGuard>
  );
}