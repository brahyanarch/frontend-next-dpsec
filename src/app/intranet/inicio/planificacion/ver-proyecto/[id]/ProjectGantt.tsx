import { Gantt, Task, ViewMode } from "gantt-task-react"
import "gantt-task-react/dist/index.css"

export default function ProjectGantt({ activities }: { activities: any[] }) {
  const tasks: Task[] = activities.map((a, i) => ({
    id: a.idActivi.toString(),
    name: a.name,
    type: "task",
    start: new Date(a.fInit),
    end: new Date(a.fFin),
    progress: a.estado === "COMPLETADO" ? 100 : a.estado === "CURSO" ? 50 : 0,
    isDisabled: false,
    dependencies: [],
  }))

  return <Gantt tasks={tasks} viewMode={ViewMode.Day} />
}
