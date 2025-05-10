// intranet\inicio\sub-configuracion\formulario\data\schema.ts
import { z } from "zod";

export const DataSchema = z.object({
  idf: z.number(),
  nmForm: z.string(),
  abre: z.string(),
  estado: z.boolean(), 

  createdAt: z.string(), 
  updatedAt: z.string() || null, 
});

export const DataArraySchema = z.array(DataSchema);
export type Data = z.infer<typeof DataSchema>;
