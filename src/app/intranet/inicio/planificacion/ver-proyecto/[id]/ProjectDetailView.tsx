"use client"

import { useState } from "react"
import { Project } from "@/types"
import ProjectTable from "./ProjectTable"
import ProjectGantt from "./ProjectGantt"
import { Button } from "@/components/ui/button"
import { Table, BarChart } from "lucide-react"

export default function ProjectDetailView({ project }: { project: Project }) {
  const [view, setView] = useState<"table" | "gantt">("table")

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button variant={view === "table" ? "default" : "outline"} onClick={() => setView("table")}>
          <Table className="w-4 h-4 mr-2" /> Tabla
        </Button>
        <Button variant={view === "gantt" ? "default" : "outline"} onClick={() => setView("gantt")}>
          <BarChart className="w-4 h-4 mr-2" /> Gantt
        </Button>
      </div>

      {view === "table" ? (
        <ProjectTable activities={project.actividad} />
      ) : (
        <ProjectGantt activities={project.actividad} />
      )}
    </div>
  )
}
