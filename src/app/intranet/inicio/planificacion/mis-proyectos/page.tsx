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
        const response = await ProjectService.getProjectsByUsuario();
        if (!response) {
          throw new Error("Error al cargar los datos.");
        }
        const data = await response.json();
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

      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-left">
              Proyectos de {user?.dataUser.nombre}
            </h2>
            <p className="text-muted-foreground">
              Lista de todos los proyectos que por lo menos tienen una actividad.
            </p>
          </div>
        </div>
        { loading ? <SkeletonTable /> :
          <DataTable data={data || []} columns={columns} />
        }
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
}
