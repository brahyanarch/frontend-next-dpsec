"use client";
import { useEffect, useState } from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/column";
import { Data, DataSchema } from "./data/schema";
import { obtenerUsuarios } from "@/services/api/auth.service";
import SkeletonTable from "@/components/skeletonTable";
import { toast, Toaster } from "sonner";
import { Label } from "@/components/ui/label"; 
import { Separator } from "@/components/ui/separator"; 
import { Button } from "@/components/ui/button"; 
import Link from 'next/link'
import { PlusCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
interface FormData {
  dni: string;
  email: string;
  nombre: string;
  aPaterno: string;
  aMaterno: string;
}


export default function UsersPage() {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await obtenerUsuarios();

        setData(data);
      } catch (err) {
        setError("Error al cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="mx-auto p-4 text-black dark:text-white space-y-4">
      <Label className="text-2xl font-bold dark:text-slate-200">
        Gestion de usuarios
      </Label>
      <Separator orientation="horizontal" className="w-full" />
      {/*
      <AsignarUsuario />
      <RegisterDataUsuario />
      <Button
        variant="default"
        className="bg-blue-600 hover:bg-blue-700 w-auto"
        asChild
      >
        <Link
          href="/intranet/inicio/sub-configuracion/formulario/nuevo-formulario"
          className=""
        >
          Agregar usuario
          <PlusCircle />
        </Link>
      </Button>*/}

      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-left">
              Usuarios de esta sub unidad
            </h2>
            <p className="text-muted-foreground">
              Lista de todos los usuarios configurados para esta sub unidad.
            </p>
          </div>
        </div>
        {loading ? (
          <SkeletonTable />
        ) : (
          <DataTable
            data={data || []}
            columns={columns}
          />
        )}
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
}


export function RegisterDataUsuario() {
  const [formData, setFormData] = useState<FormData>({
    dni: "",
    email: "",
    nombre: "",
    aPaterno: "",
    aMaterno: ""
  });

  const [errors, setErrors] = useState<{ [key in keyof FormData]?: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: { [key in keyof FormData]?: string } = {};
    if (!formData.dni) newErrors.dni = "El DNI es obligatorio";
    if (!formData.email) newErrors.email = "El email es obligatorio";
    else if (!validateEmail(formData.email)) newErrors.email = "El email no es válido";
    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.aPaterno) newErrors.aPaterno = "El apellido paterno es obligatorio";
    if (!formData.aMaterno) newErrors.aMaterno = "El apellido materno es obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const response = await fetch("https://tu-backend.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Error en el registro");
      toast.success("Usuario registrado exitosamente");
    } catch (error) {
      toast.error("Algo fallo al registrar usuario");

    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Registrar Usuario</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Registrar Nuevo Usuario</AlertDialogTitle>
          <AlertDialogDescription>Ingresa los datos del usuario.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Input className={errors.dni ? "border-red-500" : ""} placeholder="DNI" name="dni" value={formData.dni} onChange={handleChange} />
          {errors.dni && <p className="text-red-500 text-sm">{errors.dni}</p>}
          <Input className={errors.email ? "border-red-500" : ""} placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          <Input className={errors.nombre ? "border-red-500" : ""} placeholder="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
          {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
          <Input className={errors.aPaterno ? "border-red-500" : ""} placeholder="Apellido Paterno" name="aPaterno" value={formData.aPaterno} onChange={handleChange} />
          {errors.aPaterno && <p className="text-red-500 text-sm">{errors.aPaterno}</p>}
          <Input className={errors.aMaterno ? "border-red-500" : ""} placeholder="Apellido Materno" name="aMaterno" value={formData.aMaterno} onChange={handleChange} />
          {errors.aMaterno && <p className="text-red-500 text-sm">{errors.aMaterno}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button onClick={handleSubmit}>Registrar</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}



export function AsignarUsuario() {
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
          Agregar usuario
          <PlusCircle />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl text-center">
            Agregar usuario
          </AlertDialogTitle>
          <AlertDialogDescription>
            En esta sección podrás agregar los datos de un usuario nuevo para que sea asignado su ro y su sub unidad.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Label className="text-lg">Información del usuario</Label>

        <div className="relative mt-4">
          <Label
            htmlFor="nombre-formulario"
            className={`absolute left-3 transition-all duration-200 cursor-text ${
              nombre || isFocusedNombre
                ? "top-[-10px] text-sm bg-background px-1 text-primary"
                : "top-3 text-muted-foreground"
            } ${error ? "text-red-500" : ""}`}
          >
            Nombre del usuario <span className="text-red-600">*</span>
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