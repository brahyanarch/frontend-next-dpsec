export function capitalizarNombre(nombre: string | null | undefined): string {
    if (!nombre?.trim()) return ""; // Si es null, undefined o solo espacios
  
    return nombre
      .trim() // Elimina espacios al inicio/final
      .split(/\s+/) // Divide por 1 o más espacios
      .map((palabra) => palabra[0].toUpperCase() + palabra.slice(1).toLowerCase())
      .join(' ');
  }