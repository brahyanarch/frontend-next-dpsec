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
  Form, GetFormsParams, FormularioService
} from "@/services/api/formulario.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PermissionGuard } from "@/components/PermissionGuard";

// Definición de columnas
const FormColumns: ColumnDef<Form>[] = [
  {
    key: "idf",
    header: "ID",
    accessorKey: "idf",
    sortable: true,
    visible: true,
  },
  {
    key: "nmForm",
    header: "Nombre",
    accessorKey: "nmForm",
    sortable: true,
    visible: true,
  },
  {
    key: "abre",
    header: "Abreviatura",
    accessorKey: "abre",
    sortable: false,
    visible: true,
  },
  {
    key: "estado",
    header: "Estado",
    accessorKey: "estado",
    sortable: false,
    visible: true,
    cell: (value: boolean, row: Form) => (
      <EstadoCheckbox 
        estado={value} 
        form={row} 
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

//  Componente separado para el checkbox con estado interno
function EstadoCheckbox({ 
  estado, 
  form 
}: { 
  estado: boolean; 
  form: Form;
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
      await FormularioService.toggleEstado(form.idf, newEstado);
      
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
        className={`h-4 w-4 accent-green-700 cursor-pointer ${
          isUpdating ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />
      {isUpdating && (
        <span className="ml-2 text-xs text-muted-foreground">Actualizando...</span>
      )}
    </div>
  );
}

export default function FormPage() {
  const [data, setData] = useState<Form[]>([]);
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
      const params: GetFormsParams = {
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

      const response = await FormularioService.getForms(params);
      setData(response.data);
      setTotalCount(response.pagination.totalCount);
    } catch (error) {
      //console.error("Error fetching documents:", error);
      toast.error("No se pudieron cargar los formularios");
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex, pageSize, search, filters, sort]);

  // Cargar datos cuando cambien los parámetros
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Acciones por fila
  const rowActions = (row: Form) => (
    
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
          onClick={() => handleDelete(row.idf)}
          className="flex items-center gap-2 text-red-600"
        >
          <TrashIcon className="h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Manejar edición
  const handleEdit = (item: Form) => {
    //console.log("Editar formulario:", item);
    router.push("/intranet/inicio/sub-configuracion/formulario/editar-formulario/" + item.idf);
    toast.info(`Editando: ${item.nmForm}`);
  };

  // Manejar eliminación
  const handleDelete = async (id: number) => {
    toast.warning("¿Estás seguro de que quieres eliminar este Formulario?", {
      action: {
        label: "Eliminar",
        onClick: async () => {
          try {
            await FormularioService.deleteForm(id);
            toast.success("El Formularios se eliminó correctamente");
            fetchData(); // Recargar datos
          } catch (error) {
            //console.error("Error deleting document:", error);
            toast.error("No se pudo eliminar el Formulario");
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
    router.push("/intranet/inicio/sub-configuracion/formulario/nuevo-formulario");
  
    toast.info("Crear nuevo Formulario");
  };

  return (
    <PermissionGuard requiredPermission="VER_FORMULARIOS">

    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Formularios</h1>
          <p className="text-muted-foreground">
            Administra y organiza tus formularios de esta Sub Unidad de manera eficiente.
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Nuevo formulario
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        data={data}
        columns={FormColumns}
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