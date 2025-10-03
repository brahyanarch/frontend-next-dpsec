import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function ProjectTable({ activities }: { activities: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Inicio</TableHead>
          <TableHead>Fin</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Público</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((act) => (
          <TableRow key={act.idActivi}>
            <TableCell>{act.name}</TableCell>
            <TableCell>{format(new Date(act.fInit), "dd/MM/yyyy")}</TableCell>
            <TableCell>{format(new Date(act.fFin), "dd/MM/yyyy")}</TableCell>
            <TableCell><Badge>{act.estado}</Badge></TableCell>
            <TableCell>{act.tipo}</TableCell>
            <TableCell>{act.public ? "Sí" : "No"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
