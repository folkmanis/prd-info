import { z } from 'zod';

export const Equipment = z.object({
  _id: z.string(),

  name: z.string(),

  description: z.string().optional(),
});
export type Equipment = z.infer<typeof Equipment>;

export const EquipmentPartial = Equipment.pick({ _id: true, name: true });
export type EquipmentPartial = z.infer<typeof EquipmentPartial>;

export const EquipmentUpdate = Equipment.omit({ _id: true }).partial();
export type EquipmentUpdate = z.infer<typeof EquipmentUpdate>;

export const EquipmentCreate = Equipment.omit({ _id: true });
export type EquipmentCreate = z.infer<typeof EquipmentCreate>;
