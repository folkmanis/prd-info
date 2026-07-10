import { Material, MaterialCreate, MaterialPriceSchema, MaterialSchema, MaterialUpdate } from 'src/app/interfaces';
import { nullableString, numberToString, optionalString, pickNotNull } from 'src/app/library';
import { z } from 'zod';

export const MaterialPriceModelSchema = z.object({
  description: optionalString,
  price: numberToString,
  min: numberToString,
});
export type MaterialPriceModel = z.infer<typeof MaterialPriceModelSchema>;

export const MaterialModelSchema = z.object({
  ...MaterialSchema.omit({ _id: true }).shape,
  prices: z.array(MaterialPriceModelSchema),
  description: nullableString,
  fixedPrice: numberToString,
});
export type MaterialModel = z.infer<typeof MaterialModelSchema>;

export function materialToModel(material: Material): MaterialModel {
  return MaterialModelSchema.decode(material);
}

export function modelToMaterialCreate(model: MaterialModel): MaterialCreate {
  const create = MaterialModelSchema.encode(model);
  return pickNotNull(create);
}

export function modelToMaterialUpdate(model: Partial<MaterialModel>): MaterialUpdate {
  const update = MaterialModelSchema.partial().encode(model);
  return update;
}

export const newMaterialPrice: () => MaterialPriceModel = () => ({
  min: '',
  price: '',
  description: '',
});


