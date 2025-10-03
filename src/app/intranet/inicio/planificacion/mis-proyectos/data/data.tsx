import {
  FolderCheck,
  FolderClock,
  FolderOpenDot,
  FolderLock,
} from "lucide-react";

/*
PENDIENTE
  ARCHIVADO
  CURSO
  COMPLETADO*/
export const estados = [
  {
    value: "COMPLETADO",
    label: "COMPLETADO",
    icon: FolderCheck,
    color: "bg-green-100", // Fondo
    borderColor: "border-green-400", // Borde
    textColor: "text-green-800", // Texto
  },
  {
    value: "PENDIENTE",
    label: "PENDIENTE",
    icon: FolderClock,
    color: "bg-yellow-100", // Fondo
    borderColor: "border-yellow-400", // Borde
    textColor: "text-yellow-600", // Texto
  },
  {
    value: "CURSO",
    label: "EN CURSO",
    icon: FolderOpenDot,
    color: "bg-blue-100", // Fondo
    borderColor: "border-blue-400", // Borde
    textColor: "text-blue-600", // Texto
  },
  {
    value: "ARCHIVADO",
    label: "ARCHIVADO",
    icon: FolderLock,
    color: "bg-red-100", // Fondo
    borderColor: "border-red-400", // Borde
    textColor: "text-red-600", // Texto
  },
];
