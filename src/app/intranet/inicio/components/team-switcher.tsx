"use client";
import Cookies from "js-cookie";
import * as React from "react";
import { ChevronsUpDown, Plus, GalleryVerticalEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { AuthService } from "@/services/api/auth.service";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);
  const [activeUser, setActiveUser] = React.useState<any>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);

  const handleRoleSelection = async (user: any) => {
    setError(null);
    console.log("Seleccionando rol para el usuario:", user);
    try {
      const data = await AuthService.loginUnique({
        iddatauser: user.iddatauser,
        roles: user.roles,
        subunidad: user.subunidad,
      });

      Cookies.set("auth-token", data.token, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      

      // opcional: refrescar el estado global de usuario si usas useAuth()
      setActiveUser(user);
      

      // refrescar la página para aplicar el nuevo rol
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    }
  };

  React.useEffect(() => {
    // Set initial activeUser to user?.usuario if available
    if (user?.usuario) {
      setActiveUser(user.usuario);
    }
  }, [user]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeUser?.roles.n_rol}
                </span>
                <span className="truncate text-xs">
                  {activeUser?.subunidad.n_subuni}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Roles
            </DropdownMenuLabel>
            {(user?.usuarios ?? []).map((userItem, index) => {
              const isActive = activeUser?.iduser === userItem.iduser;
              return (
                <DropdownMenuItem
                  key={userItem.iduser}
                  onClick={() => {
                    if (!isActive) {
                      handleRoleSelection({
                        iddatauser: user?.usuario.iddatauser, // ⚡ ojo: este dato viene de dataUser, no de userItem
                        roles: userItem.roles,
                        subunidad: userItem.subunidad,
                      });
                    }
                  }}
                  className="gap-2 p-2"
                  disabled={isActive}
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div>
                    <p className="font-medium text-shadow-muted-foreground truncate max-w-[250px]">
                      {userItem.roles.n_rol}
                    </p>
                    <p>
                      <span className="text-xs text-muted-foreground">
                        {userItem.subunidad.n_subuni}
                      </span>
                    </p>
                  </div>
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Agregar rol
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
