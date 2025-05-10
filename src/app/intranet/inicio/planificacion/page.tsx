export default async function RolesPage() {
  const res = await fetch('https://2nlfx0w1-3006.brs.devtunnels.ms/api/roles') || [];
  const roles = await res.json(); // roles contiene tu array de datos
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Gestión de Roles</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((rol: any) => (
          <div 
            key={rol.id_rol}
            className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold">{rol.n_rol}</h2>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {rol.abrev}
              </span>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p><span className="font-medium">ID:</span> {rol.id_rol}</p>
              <p><span className="font-medium">Creado:</span> {new Date(rol.createdAt).toLocaleDateString()}</p>
              <p><span className="font-medium">Actualizado:</span> {new Date(rol.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}