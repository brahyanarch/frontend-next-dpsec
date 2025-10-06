"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Seccion = {
  idpd: string;
  type: string;
  contenido: string | string[];
  iseditable: boolean;
};

export default function CrearPlantilla() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombrePlantilla: '',
    abreviatura: '',
    descripcion: ''
  });
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [nuevaSeccion, setNuevaSeccion] = useState({
    type: 'text',
    contenido: '',
    iseditable: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular creación - en realidad enviarías a la API
    alert('Plantilla creada (simulación)');
    router.push('/');
  };

  const agregarSeccion = () => {
    if (nuevaSeccion.contenido.trim()) {
      const seccion: Seccion = {
        idpd: `${Date.now()}`,
        type: nuevaSeccion.type,
        contenido: nuevaSeccion.contenido,
        iseditable: nuevaSeccion.iseditable
      };
      setSecciones([...secciones, seccion]);
      setNuevaSeccion({ type: 'text', contenido: '', iseditable: true });
    }
  };

  const eliminarSeccion = (idpd: string) => {
    setSecciones(secciones.filter(sec => sec.idpd !== idpd));
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
          <h1 className="text-3xl font-bold text-gray-800">Crear Nueva Plantilla</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
          {/* Información Básica */}
          <div className="grid gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Plantilla *
              </label>
              <input
                type="text"
                required
                value={formData.nombrePlantilla}
                onChange={(e) => setFormData({...formData, nombrePlantilla: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Informe Técnico Mensual"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abreviatura *
                </label>
                <input
                  type="text"
                  required
                  value={formData.abreviatura}
                  onChange={(e) => setFormData({...formData, abreviatura: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: INF-TEC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Breve descripción de la plantilla"
                />
              </div>
            </div>
          </div>

          {/* Agregar Secciones */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Agregar Sección</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={nuevaSeccion.type}
                    onChange={(e) => setNuevaSeccion({...nuevaSeccion, type: e.target.value})}
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
                    Contenido *
                  </label>
                  <input
                    type="text"
                    required
                    value={nuevaSeccion.contenido}
                    onChange={(e) => setNuevaSeccion({...nuevaSeccion, contenido: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contenido de la sección"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={nuevaSeccion.iseditable}
                      onChange={(e) => setNuevaSeccion({...nuevaSeccion, iseditable: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Editable</span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={agregarSeccion}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                + Agregar Sección
              </button>
            </div>
          </div>

          {/* Lista de Secciones Agregadas */}
          {secciones.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Secciones de la Plantilla ({secciones.length})
              </h3>
              <div className="space-y-3">
                {secciones.map((seccion, index) => (
                  <div key={seccion.idpd} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {seccion.type}
                      </span>
                      <span className="text-gray-700">{seccion.contenido}</span>
                      <span className={`text-xs px-2 py-1 rounded ${seccion.iseditable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {seccion.iseditable ? 'Editable' : 'Fijo'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarSeccion(seccion.idpd)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Plantilla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}