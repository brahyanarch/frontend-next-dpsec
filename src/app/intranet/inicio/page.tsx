import React from "react";
import StatusBadge, {Archivado,Completado,EnCurso,Pendiente} from "@/components/project/status";
const activities = {
  Completado:2,
  Pendiente: 1,
  Archivado: 3,
  Curso: 4,
}
const Page = () => {
  return (
    <main>
      <div className="flex items-center justify-around space-x-2 mx-auto p-4">
        <Completado />
        <p className="pr-7 font-extralight">
          {" "}
          {activities?.Completado || 0} Actividades Completados
        </p>
        <Pendiente />
        <p className="pr-7">
          {activities?.Pendiente || 0} Actividades pendientes
        </p>
        <Archivado />
        <p className="pr-7">
          {activities?.Archivado || 0} Actividades archivados
        </p>
        <EnCurso />
        <p className="pr-7">{activities?.Curso || 0} Actividades en curso</p>
      </div>
      <div className="">
        <StatusBadge status="Curso" />
        <StatusBadge status="Completado" />
        <StatusBadge status="Pendiente" />
        <StatusBadge status="Archivado" />
      </div>

      
    </main>
  );
};

export default Page;
