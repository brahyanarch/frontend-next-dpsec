"use client";
import ProjectDetailView from "./ProjectDetailView";
import { Project } from "@/types";
import { useParams } from 'next/navigation'

// en props ya tienes `project`
export default function VerProyecto() {
  const { id } = useParams<{ id: string }>();
  
  const project = {
    idproj: parseInt(id as string),
    plan: "Plan de Desarrollo 2025",
    estado: "CURSO",
    tipo: "SUBUNIDAD",
    idString: "PROJ-001",
    fInit: "2025-07-01T00:00:00.000Z",
    fFin: "2025-08-01T00:00:00.000Z",
    informeFinal: "/docs/informe-final-proyecto-1.pdf",
    actividad: [
      {
        idActivi: 1,
        name: "Taller de Capacitación",
        fInit: "2025-07-02T00:00:00.000Z",
        fFin: "2025-07-05T00:00:00.000Z",
        estado: "COMPLETADO",
        tipo: "normal",
        public: true,
      },
      {
        idActivi: 2,
        name: "Evaluación de Resultados",
        fInit: "2025-07-10T00:00:00.000Z",
        fFin: "2025-07-12T00:00:00.000Z",
        estado: "PENDIENTE",
        tipo: "normal",
        public: false,
      }
    ]
  }
  return <ProjectDetailView project={project} />
}
