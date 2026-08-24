import { z } from 'zod';

export const EquipmentSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  disabled: z.boolean(),
});
export type Equipment = z.infer<typeof EquipmentSchema>;

export const EquipmentListSchema = EquipmentSchema.pick({ _id: true, name: true, disabled: true });
export type EquipmentList = z.infer<typeof EquipmentListSchema>;

export const EquipmentUpdateSchema = z
  .object({ ...EquipmentSchema.shape, description: z.string().nullable() })
  .omit({ _id: true })
  .partial();
export type EquipmentUpdate = z.infer<typeof EquipmentUpdateSchema>;

export const EquipmentCreateSchema = EquipmentSchema.omit({ _id: true });
export type EquipmentCreate = z.infer<typeof EquipmentCreateSchema>;
