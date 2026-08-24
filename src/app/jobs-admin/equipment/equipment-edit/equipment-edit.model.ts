import { Equipment, EquipmentCreate, EquipmentUpdate } from 'src/app/interfaces';
import { nullableString, pickNotNull } from 'src/app/library';
import { z } from 'zod';

const EquipmentModelSchema = z.object({
  name: z.string(),
  description: nullableString,
  disabled: z.boolean(),
});
export type EquipmentModel = z.infer<typeof EquipmentModelSchema>;

export function equipmentToModel(equipment: Equipment): EquipmentModel {
  return EquipmentModelSchema.decode(equipment);
}

export function modelToEquipmentCreate(model: EquipmentModel): EquipmentCreate {
  const equipment = EquipmentModelSchema.encode(model);
  return pickNotNull(equipment);
}

export function modelToEquipmentUpdate(model: Partial<EquipmentModel>): EquipmentUpdate {
  const equipment = EquipmentModelSchema.partial().encode(model);
  return equipment;
}
