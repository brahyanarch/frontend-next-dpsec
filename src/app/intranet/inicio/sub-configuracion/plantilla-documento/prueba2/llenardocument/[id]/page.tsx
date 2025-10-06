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

export default function LlenarDocumento() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const plantilla = PlantillaDocum.find(p => p.id === id);
  const [valores, setValores] = useState<Record<string, string>>({});
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

  const handleInputChange = (idpd: string, valor: string) => {
    setValores(prev => ({ ...prev, [idpd]: valor }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular envío
    setTimeout(() => {
      setIsLoading(false);
      alert('Documento completado y guardado (simulación)');
      router.push('/');
    }, 1000);
  };

  const renderSeccion = (seccion: any) => {
    switch (seccion.type) {
      case 'section':
        return (
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">
              {seccion.contenido}
            </h3>
          </div>
        );

      case 'subsection':
        return (
          <div className="mb-4">
            <h4 className="text-xl font-semibold text-gray-700">
              {seccion.contenido}
            </h4>
          </div>
        );

      case 'text':
        return (
          <div className="mb-4">
            {seccion.iseditable ? (
              <textarea
                value={valores[seccion.idpd] || seccion.contenido}
                onChange={(e) => handleInputChange(seccion.idpd, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[100px] resize-y"
                placeholder="Escribe aquí..."
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                {seccion.contenido}
              </p>
            )}
          </div>
        );

      case 'enumerate':
        if (seccion.iseditable) {
          return (
            <div className="mb-4">
              <textarea
                value={valores[seccion.idpd] || (Array.isArray(seccion.contenido) ? seccion.contenido.join('\n') : seccion.contenido)}
                onChange={(e) => handleInputChange(seccion.idpd, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[120px] resize-y"
                placeholder="Escribe cada punto en una línea separada..."
              />
              <p className="text-sm text-gray-500 mt-1">
                💡 Escribe cada elemento de la lista en una línea separada
              </p>
            </div>
          );
        } else {
          return (
            <div className="mb-4">
              <ul className="list-disc list-inside space-y-1 bg-gray-50 p-4 rounded-lg">
                {Array.isArray(seccion.contenido) 
                  ? seccion.contenido.map((item: string, index: number) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))
                  : <li className="text-gray-700">{seccion.contenido}</li>
                }
              </ul>
            </div>
          );
        }

      default:
        return null;
    }
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
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {plantilla.nombrePlantilla}
            </h1>
            <p className="text-gray-600">{plantilla.descripcion}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
          {/* Header del Documento */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">
                  {plantilla.nombrePlantilla}
                </h2>
                <p className="text-blue-700">{plantilla.descripcion}</p>
              </div>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {plantilla.abreviatura}
              </span>
            </div>
          </div>

          {/* Secciones del Documento */}
          <div className="space-y-6">
            {plantilla.secciones.map((seccion) => (
              <div key={seccion.idpd}>
                {renderSeccion(seccion)}
                {seccion.iseditable && (
                  <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
                    <span>✏️</span>
                    <span>Esta sección es editable</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-4 pt-8 mt-8 border-t border-gray-200">
            <Link
              href="/intranet/inicio/sub-configuracion/plantilla-documento/prueba2"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Completar Documento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}