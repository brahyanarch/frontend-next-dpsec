import { z } from "zod"

export const DataSchema = z.object({
  iduser: z.number(),
  datausuario: z.object({
    APaterno: z.string(),
    AMaterno: z.string(),
    nombre: z.string(),
    dni: z.string(),
    iddatauser: z.number()
  }),
  estado: z.boolean(),
  roles: z.object({
    n_rol: z.string(),
    id_rol: z.number()
  }),
  subunidad: z.object({
    n_subuni: z.string(),
    id_subuni: z.number()
  })
})


export type Data = z.infer<typeof DataSchema>