import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/services/api/API.service";
export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Obtén la cookie que contiene el token
  const token = request.cookies.get("auth-token")?.value; // "auth-token" es el nombre de la cookie

  // Verifica si la ruta es /intranet/
  if (url.pathname.startsWith("/intranet/inicio")) {
    if (!token || !API_URL) {
      // Si no hay token en la cookie, redirige a la página de inicio de sesión
      return NextResponse.redirect(new URL("/intranet", request.url));
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      // Verifica la autenticación con el servidor
      const response = await fetch(`${API_URL}/api/auth/authenticate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        // Si la autenticación falla, redirige a la página de inicio de sesión
        return NextResponse.redirect(new URL("/intranet", request.url));
      }
      
      const responseClone = response.clone();
      const authData = await responseClone.json();
      // Si todo está bien, permite que la solicitud continúe
      // Pasar datos de autenticación a las páginas
      const newHeaders = new Headers(request.headers);
      newHeaders.set("x-user-data", JSON.stringify(authData));

      return NextResponse.next({
        request: { headers: newHeaders }
      });
    } catch (error) {
      console.error(error);
      // Si hay un error, redirige a la página de inicio de sesión
      return NextResponse.redirect(new URL("/intranet", request.url));
    }
  }

  // Si la ruta no es /intranet/, permite que la solicitud continúe
  return NextResponse.next();
}