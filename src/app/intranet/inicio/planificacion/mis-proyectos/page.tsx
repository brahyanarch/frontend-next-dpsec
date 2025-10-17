"use client";

import { useState, useEffect } from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/column";
import { z } from "zod";
import { ProjectSchema, Project } from "./data/schema";
import {useAuth} from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";

import SkeletonTable from "@/components/skeletonTable";
import { Toaster } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { ProjectService } from '@/services/api/project.service';

export default function TaskPage() {
  const [data, setData] = useState<Project[] | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, loading, logout } = useAuth();
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await ProjectService.getProjectsByUsuario();
        if (!data) {
          throw new Error("Error al cargar los datos.");
        }
        //const data = await response.json();
        const parsedData = z.array(ProjectSchema).parse(data);
        setData(parsedData);
      } catch (err) {
        setError("Hubo un error al cargar los datos.");
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchProjects();
  }, []); 



  const cambiarEstadoPrimerProyecto = async () => {
  if (!data || data.length === 0) return;

  try {
    let num = 3;
    const projectId = data[num].idproj;
    const nuevoEstado = "ARCHIVADO";
    
    // Actualización optimista local
    setData(prevData => {
      if (!prevData) return null;
      const newData = [...prevData];
      newData[num] = { ...newData[num], estado: nuevoEstado };
      return newData;
    });

    // Llamada a la API
    //await ProjectService.updateProjectStatus(projectId, nuevoEstado);
    
    console.log("Estado cambiado correctamente");
    // Opcional: Mostrar notificación de éxito
    // toast.success("Estado actualizado correctamente");
  } catch (error: any) {
    console.error("Error al cambiar estado:", error);
    
    // Revertir cambios en caso de error
    let num = 3;
    setData(prevData => {
      if (!prevData) return null;
      const newData = [...prevData];
      newData[num] = { ...newData[num], estado: data[num].estado }; // Restaurar estado original
      return newData;
    });

    // Opcional: Mostrar notificación de error
    // toast.error("Error al actualizar el estado");
  }
};

  return (
    <div className="mx-auto p-4 text-black dark:text-white space-y-4">
      <Label className="text-2xl font-bold dark:text-slate-200">
        Proyectos
      </Label>
      {/*<AlertDialogDemo />*/}
      <Separator orientation="horizontal" className="w-full" />
      <Button
        variant="default"
        className="bg-blue-600 hover:bg-blue-700 w-auto"
        asChild
      >
        <Link
          href="/intranet/inicio/planificacion/mis-proyectos/nuevo-proyecto"
          className=""
        >
          Nuevo proyecto
          <PlusCircle />
        </Link>
      </Button>
      <Button 
        onClick={cambiarEstadoPrimerProyecto}
        variant="outline"
        disabled={!data || data.length === 0}
      >
        Archivar primer proyecto
      </Button>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-left">
              Proyectos de {user?.dataUser.nombre}
            </h2>
            <p className="text-muted-foreground">
              Lista de todos los proyectos que por lo menos tienen una
              actividad.
            </p>
          </div>
        </div>
        {loading ? (
          <SkeletonTable />
        ) : (
          <DataTable data={data || []} columns={columns} />
        )}
        {/*<Toaster position="bottom-right" />*/}
      </div>
    </div>
  );
}
