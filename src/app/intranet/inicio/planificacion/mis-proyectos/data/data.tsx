import {
  FolderCheck,
  FolderClock,
  FolderOpenDot,
  FolderLock,
} from "lucide-react";

export const estados = [
  {
    value: "Completado",
    label: "Completado",
    icon: FolderCheck,
    color: "bg-green-100", // Fondo
    borderColor: "border-green-400", // Borde
    textColor: "text-green-800", // Texto
  },
  {
    value: "Pendiente",
    label: "Pendiente",
    icon: FolderClock,
    color: "bg-yellow-100", // Fondo
    borderColor: "border-yellow-400", // Borde
    textColor: "text-yellow-600", // Texto
  },
  {
    value: "EnCurso",
    label: "En Curso",
    icon: FolderOpenDot,
    color: "bg-blue-100", // Fondo
    borderColor: "border-blue-400", // Borde
    textColor: "text-blue-600", // Texto
  },
  {
    value: "Archivado",
    label: "Archivado",
    icon: FolderLock,
    color: "bg-red-100", // Fondo
    borderColor: "border-red-400", // Borde
    textColor: "text-red-600", // Texto
  },
];
