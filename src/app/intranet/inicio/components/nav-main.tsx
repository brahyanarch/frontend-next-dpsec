"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { PermissionGuard } from "@/components/PermissionGuard"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  requiredPermission?: string
  items?: {
    title: string
    url: string
    requiredPermission?: string
  }[]
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Configuración</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <PermissionGuard
            key={item.title}
            requiredPermission={item.requiredPermission ?? ""}
          >
            <Collapsible
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <PermissionGuard
                        key={subItem.title}
                        requiredPermission={subItem.requiredPermission ?? ""}
                      >
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </PermissionGuard>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </PermissionGuard>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
