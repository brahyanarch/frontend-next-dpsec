// intranet\inicio\sub-configuracion\formulario\data\schema.ts
import { z } from "zod";

export const DocumentSchema = z.object({
  idplantilladoc: z.number(),
  nombre: z.string(),
  estado: z.boolean(), 
  descripcion: z.string() || null,
  createdAt: z.string(), 
  updatedAt: z.string() || null, 
});

export const DataArraySchema = z.array(DocumentSchema);
export type Document = z.infer<typeof DocumentSchema>;
