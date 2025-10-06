import Link from 'next/link';

// Datos mock - reemplazarás esto con tu const
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
      }
    ]
  },
  {
    id: "2",
    nombrePlantilla: "Acta de Reunión",
    abreviatura: "ACT-REU",
    descripcion: "Formato estándar para registrar reuniones de equipo",
    secciones: [
      {
        idpd: "2-1",
        type: "section",
        contenido: "Datos de la reunión",
        iseditable: false
      },
      {
        idpd: "2-2",
        type: "text",
        contenido: "Fecha: \nHora: \nParticipantes:",
        iseditable: true
      }
    ]
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Sistema de Plantillas Documentales</h1>
          <Link 
            href="/intranet/inicio/sub-configuracion/plantilla-documento/prueba2/crear" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nueva Plantilla
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PlantillaDocum.map((plantilla) => (
            <div key={plantilla.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-gray-800">{plantilla.nombrePlantilla}</h2>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {plantilla.abreviatura}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{plantilla.descripcion}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span>{plantilla.secciones.length} secciones</span>
                  <span className="mx-2">•</span>
                  <span>
                    {plantilla.secciones.filter(s => s.iseditable).length} editables
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link 
                    href={`/intranet/inicio/sub-configuracion/plantilla-documento/prueba2/editar/${plantilla.id}`}
                    className="flex-1 bg-orange-500 text-white text-center py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Editar
                  </Link>
                  <Link 
                    href={`/intranet/inicio/sub-configuracion/plantilla-documento/prueba2/llenardocument/${plantilla.id}`}
                    className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Completar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {PlantillaDocum.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay plantillas creadas</h3>
            <p className="text-gray-500 mb-6">Comienza creando tu primera plantilla documental</p>
            <Link 
              href="/intranet/inicio/sub-configuracion/plantilla-documento/prueba2/crear" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Primera Plantilla
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}