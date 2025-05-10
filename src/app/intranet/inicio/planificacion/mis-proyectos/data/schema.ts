import { z } from "zod";

export const ProjectSchema = z.object({
  idproj: z.number(),
  idString: z.string(),
  estado: z.string(),
  fInit: z.string(), // Valida que sea una fecha ISO 8601
  fFin: z.string(),  // Valida que sea una fecha ISO 8601
  
  createdAt: z.string(), // Valida que sea una fecha ISO 8601
  updatedAt: z.string(),// Valida que sea una fecha ISO 8601
});

export type Project = z.infer<typeof ProjectSchema>;
