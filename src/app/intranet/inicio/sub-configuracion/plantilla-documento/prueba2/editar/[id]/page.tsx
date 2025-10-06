"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// Datos mock
const PlantillaDocum = [
  {
    id: "1",
    nombrePlantilla: "Informe Técnico",
    abreviatura: "INF-TEC",
    descripcion: "Plantilla base para informes técnicos mensuales",
    secciones: [
      {
        idpd: "1-1",
        type: "section",
        contenido: "Introducción",
        iseditable: false
      },
      {
        idpd: "1-2",
        type: "subsection",
        contenido: "Objetivos del informe",
        iseditable: true
      },
      {
        idpd: "1-3",
        type: "text",
        contenido: "Describir brevemente los objetivos alcanzados...",
        iseditable: true
      },
      {
        idpd: "1-4",
        type: "enumerate",
        contenido: [
          "Punto 1: Recolección de datos",
          "Punto 2: Análisis de resultados"
        ],
        iseditable: true
      }
    ]
  }
];

type Seccion =
  | { idpd: string; type: string; contenido: string; iseditable: boolean }
  | { idpd: string; type: string; contenido: string[]; iseditable: boolean };

export default function EditarPlantilla() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const plantillaOriginal = PlantillaDocum.find(p => p.id === id);
  const [plantilla, setPlantilla] = useState(plantillaOriginal);
  const [isLoading, setIsLoading] = useState(false);

  if (!plantilla) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Plantilla no encontrada</h2>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const actualizarSeccion = (idpd: string, campo: string, valor: any) => {
    setPlantilla(prev => ({
      ...prev!,
      secciones: prev!.secciones.map(sec => 
        sec.idpd === idpd ? { ...sec, [campo]: valor } : sec
      )
    }));
  };

  const eliminarSeccion = (idpd: string) => {
    setPlantilla(prev => ({
      ...prev!,
      secciones: prev!.secciones.filter(sec => sec.idpd !== idpd)
    }));
  };

  const agregarSeccion = () => {
    const nuevaSeccion: Seccion = {
      idpd: `${Date.now()}`,
      type: 'text',
      contenido: '',
      iseditable: true
    };
    setPlantilla(prev => ({
      ...prev!,
      secciones: [...prev!.secciones, nuevaSeccion]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular guardado
    setTimeout(() => {
      setIsLoading(false);
      alert('Cambios guardados (simulación)');
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="text-gray-500 hover:text-gray-700"
          >
            ← Volver
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            Editando: {plantilla.nombrePlantilla}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
          {/* Información Básica */}
          <div className="grid gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Plantilla
              </label>
              <input
                type="text"
                value={plantilla.nombrePlantilla}
                onChange={(e) => setPlantilla({...plantilla, nombrePlantilla: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abreviatura
                </label>
                <input
                  type="text"
                  value={plantilla.abreviatura}
                  onChange={(e) => setPlantilla({...plantilla, abreviatura: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  value={plantilla.descripcion}
                  onChange={(e) => setPlantilla({...plantilla, descripcion: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Secciones */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Secciones ({plantilla.secciones.length})
              </h3>
              <button
                type="button"
                onClick={agregarSeccion}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                + Nueva Sección
              </button>
            </div>

            <div className="space-y-4">
              {plantilla.secciones.map((seccion, index) => (
                <div key={seccion.idpd} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo
                      </label>
                      <select
                        value={seccion.type}
                        onChange={(e) => actualizarSeccion(seccion.idpd, 'type', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="section">Sección</option>
                        <option value="subsection">Subsección</option>
                        <option value="text">Texto</option>
                        <option value="enumerate">Lista</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenido
                      </label>
                      <input
                        type="text"
                        value={typeof seccion.contenido === 'string' ? seccion.contenido : seccion.contenido.join(', ')}
                        onChange={(e) => actualizarSeccion(seccion.idpd, 'contenido', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-end space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={seccion.iseditable}
                          onChange={(e) => actualizarSeccion(seccion.idpd, 'iseditable', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Editable</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => eliminarSeccion(seccion.idpd)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {seccion.type === 'enumerate' && (
                    <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
                      💡 Para listas, separa los elementos con coma y espacio
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}