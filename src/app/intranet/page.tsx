"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import Cookies from "js-cookie";
import { LoginResponse, RoleProps, User } from "@/types";
import { login, loginUnique } from "@/services/api/auth.service";

function RoleCard({ title, subtitle, onClick }: RoleProps) {
  return (
    <Card
      className="w-48 h-48 bg-gray-50 text-black border border-gray-600 flex flex-col items-center justify-between cursor-pointer hover:bg-gray-200"
      onClick={onClick}
    >
      <CardContent className="text-center p-4">
        <div className="text-4xl font-bold text-green-500 mb-4">M</div>
        <div className="text-sm">{title}</div>
        <div className="text-blue-400 text-xs mt-1">{subtitle}</div>
      </CardContent>
    </Card>
  );
}

const RoleSelectionPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<User[]>([]);
  const [admin, setAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const data: LoginResponse = await login(email, password);
      
      if (data.admin) {
        localStorage.setItem("token", data.token);
        setAdmin(true);
      } else {
        setUserRoles(data.users);
      }
    } catch (error: any) {
      setError("Error al logearse");
    }
  };

  const handleRoleSelection = async (user: User) => {
    setError(null);
    try {
      const data = await loginUnique(user);
      Cookies.set("auth-token", data.token, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
      });
      router.push(`/intranet/inicio`);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (admin) {
      router.push(`/intranet/panel`);
    }
  }, [admin, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-300">
      {userRoles.length > 0 ? (
        <div className="w-[50%] space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Selecciona un Rol y Subunidad</h2>
          <div className="grid grid-cols-3 gap-4">
            {userRoles.map((user, index) => (
              <RoleCard
                key={`${user.iddatauser}-${index}`}
                title={user.roles.n_rol}
                subtitle={user.subunidad.n_subuni}
                onClick={() => handleRoleSelection(user)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden">
            <div className="bg-[#1a2942] p-8 text-white flex flex-col items-center justify-center text-center">
              <div className="relative w-32 h-32 mb-6">
                <Image
                  src="/resources/images/sinFondoLogo.png"
                  alt="Universidad Nacional del Altiplano"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-medium mb-2">
                Gestor de <span className="text-emerald-400">Proyectos</span>
              </h1>
              <p className="text-sm opacity-90 mb-6">
                Oficina de Dirección de Proyección Social y Extension Cultural
              </p>
              <div className="mt-auto text-emerald-400 text-sm">GENSEG</div>
              <div className="text-xs opacity-70 mt-2">
                © Universidad Nacional del Altiplano, Puno - Perú, 2025.
              </div>
            </div>

            <div className="p-8 flex flex-col justify-center">
              <h2 className="text-2xl text-center font-medium text-gray-900 mb-8">
                Iniciar Sesión
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="text"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingrese su correo electrónico"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                    aria-placeholder="••••••••"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Recordar contraseña
                  </Label>
                </div>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                  Ingresar Ahora
                </Button>
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RoleSelectionPage;