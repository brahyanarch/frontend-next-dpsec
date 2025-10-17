// app/tasks/page.tsx
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TasksService,
  Task,
  GetTasksParams,
} from "@/services/api/tasks.service";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definición de columnas con alias
const taskColumns: ColumnDef<Task>[] = [
  {
    key: "idtask",
    header: "ID",
    accessorKey: "idtask",
    sortable: true,
    visible: true,
  },
  {
    key: "title",
    header: "Título",
    accessorKey: "title",
    sortable: true,
    visible: true,
  },
  {
    key: "description",
    header: "Descripción",
    accessorKey: "description",
    sortable: false,
    visible: true,
  },
  {
    key: "estado",
    header: "Estado",
    accessorKey: "estado",
    sortable: true,
    visible: true,
    cell: (value: string) => {
      const variants = {
        PENDIENTE: {
          variant: "secondary" as const,
          label: "Pendiente",
          className: "bg-yellow-100 text-yellow-800 border border-yellow-300",
        },
        ENPROCESO: {
          variant: "default" as const,
          label: "En Proceso",
          className: "bg-blue-100 text-blue-800 border border-blue-300",
        },
        COMPLETADO: {
          variant: "default" as const,
          label: "Completado",
          className: "bg-green-100 text-green-800 border border-green-300",
        },
        ARCHIVADO: {
          variant: "outline" as const,
          label: "Archivado",
          className: "bg-red-100 text-red-800 border border-red-300",
        },
      };

      const config =
        variants[value as keyof typeof variants] || variants.PENDIENTE;

      return (
        <Badge variant={config.variant} className={config.className}>
          {config.label}
        </Badge>
      );
    },
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

export default function TasksPage() {
  const [data, setData] = useState<Task[]>([]);
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

  // Función para cargar datos
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: GetTasksParams = {
        page: pageIndex + 1, // Tu API usa page 1-based
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

      const response = await TasksService.getTasks(params);
      setData(response.data);
      setTotalCount(response.pagination.totalCount);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("No se pudieron cargar las tareas");
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex, pageSize, search, filters, sort]);

  // Cargar datos cuando cambien los parámetros
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Acciones por fila
  const rowActions = (row: Task) => (
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
          onClick={() => handleDelete(row.idtask)}
          className="flex items-center gap-2 text-red-600"
        >
          <TrashIcon className="h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Manejar edición
  const handleEdit = (task: Task) => {
    console.log("Editar tarea:", task);
    toast.info(`Editando: ${task.title}`);
    // Aquí puedes abrir un modal o formulario de edición
  };

  // Manejar eliminación
  const handleDelete = async (id: number) => {
    toast.warning("¿Estás seguro de que quieres eliminar esta tarea?", {
      action: {
        label: "Eliminar",
        onClick: async () => {
          try {
            await TasksService.deleteTask(id);
            toast.success("La tarea se eliminó correctamente");
            fetchData(); // Recargar datos
          } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("No se pudo eliminar la tarea");
          }
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {
          // No acción necesaria, solo cerrar el toast
        },
      },
      duration: 10000, // 10 segundos para decidir
    });
  };

  // Manejar creación
  const handleCreate = () => {
    console.log("Crear nueva tarea");
    toast.info("Crear nueva tarea");
    // Aquí puedes abrir un modal o formulario de creación
  };

  // Filtros disponibles para estados
  const estadoFilters = [
    { label: "Todos", value: "" },
    { label: "Pendiente", value: "PENDIENTE" },
    { label: "En Proceso", value: "ENPROCESO" },
    { label: "Completado", value: "COMPLETADO" },
    { label: "Archivado", value: "ARCHIVADO" },
  ];

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Tareas</h1>
          <p className="text-muted-foreground">
            Administra y organiza tus tareas de manera eficiente
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      {/* Filtros de estado */}
      {/* Filtro de estado con ComboBox */}
      <div className="w-64 mb-4">
        <Select
          value={filters.estado || "ALL"}
          onValueChange={(value) => {
            const newFilters = { ...filters };
            if (value === "ALL") {
              delete newFilters.estado;
            } else {
              newFilters.estado = value;
            }
            setFilters(newFilters);
            setPageIndex(0); // Reset a la primera página
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="PENDIENTE">Pendiente</SelectItem>
            <SelectItem value="ENPROCESO">En Proceso</SelectItem>
            <SelectItem value="COMPLETADO">Completado</SelectItem>
            <SelectItem value="ARCHIVADO">Archivado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DataTable */}
      <DataTable
        data={data}
        columns={taskColumns}
        totalCount={totalCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageIndex(0); // Reset a la primera página
        }}
        onSortChange={setSort}
        onSearch={(value) => {
          setSearch(value);
          setPageIndex(0); // Reset a la primera página
        }}
        onFilterChange={setFilters}
        searchValue={search}
        filters={filters}
        sort={sort || undefined}
        rowActions={rowActions}
        isLoading={isLoading}
      />

      {/* Información de depuración (opcional) */}
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-medium mb-2">Información de la API:</h3>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Página actual: {pageIndex + 1}</div>
          <div>Búsqueda: "{search}"</div>
          <div>Filtros: {JSON.stringify(filters)}</div>
          <div>
            Ordenamiento: {sort ? `${sort.key}:${sort.direction}` : "Ninguno"}
          </div>
        </div>
      </div>
    </div>
  );
}
