"use client"

import type * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Projector,
  ProjectorIcon,
  Settings2,
  SquareTerminal,
  
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "david",
    email: "davidlarotapilco@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
    name: "Sub administrador",
      logo: GalleryVerticalEnd,
      plan: "Gestión Ambiental",
    },
    {
      name: "Personal de planta",
      logo: AudioWaveform,
      plan: "Extensión cultural",
    },
    {
      name: "Coordinador",
      logo: Command,
      plan: "Graduado",
    },
  ],
  projects: [
    {
      name: "inicio",
      url: "/intranet/inicio",
      icon: Frame,
    },
    {
      name: "Notificaciones",
      url: "/intranet/inicio/notificaciones",
      icon: PieChart,
    },
  ],
  navMain: [
    {
      title: "Sub configuración",
      url: "#",
      icon: Settings2,
      requiredPermission: "VER_SUBCONFIGURACION",
      items: [
        {
          title: "Formulario",
          url: "/intranet/inicio/sub-configuracion/formulario",
          requiredPermission: "VER_FORMULARIOS",
        },
        {
          title: "Usuarios",
          url: "/intranet/inicio/sub-configuracion/usuarios",
          requiredPermission: "VER_USUARIOS",
        },
        {
          title: "Plantilla Documento",
          url: "/intranet/inicio/sub-configuracion/plantilla-documento",
          requiredPermission: "VER_PLANILLA_DOCUMENTO",
        },
      ],
    },
    {
      title: "Pagína principal",
      url: "#",
      icon: Bot,
      requiredPermission: "CONFIG_PAGINA_PRINCIPAL",
      items: [
        {
          title: "Carrusel",
          url: "#",
          requiredPermission: "CONFIG_CARRUSEL",
        },
        {
          title: "Avisos",
          url: "#",
          requiredPermission: "CONFIG_AVISOS",
        },
      ],
    },
    {
      title: "Certificados",
      url: "#",
      icon: BookOpen,
      requiredPermission: "VER_CERTIFICADOS",
      items: [
        {
          title: "Alumnos",
          url: "#",
          requiredPermission: "VER_ALUMNOS",
        },
        {
          title: "Terceros",
          url: "#",
          requiredPermission: "VER_TERCEROS",
        },
        {
          title: "Plantillas",
          url: "#",
          requiredPermission: "VER_PLANTILLAS_CERTIFICADOS",
        },
      ],
    },
    {
      title: "Planificacion",
      url: "#",
      icon: SquareTerminal,
      requiredPermission: "VER_PLANIFICACION",
      items: [
        {
          title: "Mis proyectos",
          url: "/intranet/inicio/planificacion/mis-proyectos",
          requiredPermission: "VER_MIS_PROYECTOS",
        },
        {
          title: "Proyectos",
          url: "/intranet/inicio/planificacion/proyectos",
          requiredPermission: "VER_PROYECTOS",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

