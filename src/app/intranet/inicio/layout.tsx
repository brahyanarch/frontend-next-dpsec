"use client";
import { AppSidebar } from "./components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTheme, ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import Link from "next/link";
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const intranetBasePath = "/intranet"; // Define la ruta base de la intranet

  // Mapeo de nombres para las rutas
  const pathLabels: { [key: string]: string } = {
    "/intranet/dashboard": "Dashboard",
    "/intranet/settings": "Configuración",
    // Agrega más rutas y sus etiquetas aquí
  };

  // Generar los items del breadcrumb
  const generateBreadcrumbs = () => {
    const paths = pathname?.split("/").filter(Boolean) || [];
    let accumulatedPath = "";

    // Encuentra el índice donde comienza la ruta específica después de la ruta base
    const basePathParts = intranetBasePath.split("/").filter(Boolean);
    const startIndex = basePathParts.length;

    return paths.slice(startIndex).map((path, index) => {
      accumulatedPath += `/${path}`;
      const isLast = index === paths.length - startIndex - 1;

      return {
        href: `${intranetBasePath}${accumulatedPath}`,
        label:
          pathLabels[`${intranetBasePath}${accumulatedPath}`] ||
          formatPathName(path),
        isLast,
      };
    });
  };

  // Formatear nombres de ruta
  const formatPathName = (path: string) => {
    return path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((crumb, index) => (
                      <Fragment key={crumb.href}>
                        <BreadcrumbItem
                          className={index === 0 ? "hidden md:block" : ""}
                        >
                          {!crumb.isLast ? (
                            <Link href={crumb.href}>{crumb.label}</Link>
                          ) : (
                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                        {!crumb.isLast && (
                          <BreadcrumbSeparator className="hidden md:block" />
                        )}
                      </Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>

            <div className="p-5">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Layout;
