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
    {
      name: "Proyectos",
      url: "/intranet/inicio/proyectos",
      icon: Map,
      
    },
  ],
  navMain: [
    {
      title: "Sub configuración",
      url: "#",
      icon: Settings2,
      
      items: [
        {
          title: "Formulario",
          url: "/intranet/inicio/sub-configuracion/formulario",
        },
        {
          title: "Usuarios",
          url: "/intranet/inicio/sub-configuracion/usuarios",
        },
      ],
    },
    {
      title: "Pagína principal",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Carrusel",
          url: "#",
        },
        {
          title: "Avisos",
          url: "#",
        },
      ],
    },
    {
      title: "Certificados",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Alumnos",
          url: "#",
        },
        {
          title: "Terceros",
          url: "#",
        },
        {
          title: "Plantillas",
          url: "#",
        },
      ],
    },
    {
      title: "Planificacion",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Mis proyectos",
          url: "/intranet/inicio/planificacion/mis-proyectos",
        },
        {
          title: "Proyectos",
          url: "/intranet/inicio/planificacion/proyectos",
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

