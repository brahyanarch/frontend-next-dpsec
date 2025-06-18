"use client";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Plus, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect} from "react";
import Link from "next/link";
import { DataTable } from "./components/data-table";
import { columns } from "./components/column";
import { Data as Forms} from './data/schema';
import { FormularioService } from '@/services/api/formulario.service';
import SkeletonTable from "@/components/skeletonTable";
import { Separator } from "@radix-ui/react-separator";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";

export function AlertDialogDemo() {
  const [nombre, setNombre] = useState("");
  const [isFocusedNombre, setIsFocusedNombre] = useState(false);
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError(true);
      return; // Mostrar error pero no cerrar el diálogo
    }

    // Si está todo válido
    setIsOpen(false);
    setError(false);
    console.log("Formulario guardado", nombre);
    // Lógica para guardar el formulario...
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
        >
          Agregar formulario
          <PlusCircle />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl text-center">
            Agregar formulario
          </AlertDialogTitle>
          <AlertDialogDescription>
            En esta sección podrás agregar un formulario para que los usuarios
            puedan completar al subir un proyecto.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Label className="text-lg">Información del formulario</Label>

        <div className="relative mt-4">
          <Label
            htmlFor="nombre-formulario"
            className={`absolute left-3 transition-all duration-200 cursor-text ${
              nombre || isFocusedNombre
                ? "top-[-10px] text-sm bg-background px-1 text-primary"
                : "top-3 text-muted-foreground"
            } ${error ? "text-red-500" : ""}`}
          >
            Nombre del formulario <span className="text-red-600">*</span>
          </Label>
          <Input
            id="nombre-formulario"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              if (error) setError(false); // Quitar error al escribir
            }}
            onFocus={() => setIsFocusedNombre(true)}
            onBlur={() => setIsFocusedNombre(false)}
            className={`pt-4 ${error ? "border-red-500" : ""}`}
            placeholder={
              isFocusedNombre ? "Escriba aqui el nombre del formulario" : ""
            }
          />
          {error && (
            <p className="mt-2 text-sm text-red-500">
              ¡Ups! El nombre es obligatorio
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-red-600 text-white hover:bg-red-800 hover:text-white"
            onClick={() => setError(false)}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-green-600 hover:bg-green-800"
            onClick={handleContinue}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function Formulario() {
  const [formularios, setFormularios] = useState<Forms[] | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
      const loadUsers = async () => {
        try {
          const data = await FormularioService.getForms();
          if (data.length === 0) {
            console.log("No se encontraron formularios");
          }
          if (!data) {
            console.log("No se encontraron formularios");
          }
          
          setFormularios(data);
        } catch (err) {
          setError("Error al cargar los usuarios");
        } finally {
          setLoading(false);
        }
      };
  
      loadUsers();
    }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('success') === 'true') {
      toast.success('Formulario creado exitosamente');
      // Limpiar el query param
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
    if (searchParams.get('actualizado') === 'true') {
      toast.success('Formulario actualizado exitosamente');
      // Limpiar el query param
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

// Función para actualización optimista
const updateEstadoOptimista = async (idf: number, nuevoEstado: boolean) => {
  try {
    // Llamar a tu API
    if (!formularios) return false;
    const updatedData = formularios.map(form => {
      if (form.idf === idf) return { ...form, estado: nuevoEstado };
      if (form.estado) return { ...form, estado: false };
      return form;
    });
    setFormularios(updatedData);
    const response = await FormularioService.toggleEstado(idf, nuevoEstado);
    if(!response)
    {
      throw new Error('Error al actualizar el estado');
    }
    return true;
  } catch (error) {
    setFormularios(formularios); // Rollback automático

    return false;
  }
}

  console.log("Formularios:", formularios); // Depuración
  return (
    <div className="mx-auto p-4 text-black dark:text-white space-y-4">
      <Label className="text-2xl font-bold dark:text-slate-200">
        Formularios
      </Label>
      {/*<AlertDialogDemo />*/}
      <Separator orientation="horizontal" className="w-full" />
      <Button
        variant="default"
        className="bg-blue-600 hover:bg-blue-700 w-auto"
        asChild
      >
        <Link
          href="/intranet/inicio/sub-configuracion/formulario/nuevo-formulario"
          className=""
        >
          Agregar formulario
          <PlusCircle />
        </Link>
      </Button>

      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-left">
              Formularios de esta sub unidad para subir proyectos
            </h2>
            <p className="text-muted-foreground">
              Lista de todos los formularios configurados para esta sub unidad.
            </p>
          </div>
        </div>
        { loading ? 
        (<SkeletonTable /> 
          ) : (
          <DataTable data={formularios || []} columns={columns} onEstadoChange={updateEstadoOptimista}/>
          )
        }
        
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
}
