import { applyEach, required, SchemaPathTree } from '@angular/forms/signals';
import { ProductCategorySchema, ProductUnitSchema } from 'src/app/interfaces';
import { optionalString } from 'src/app/library';
import { z } from 'zod';

export const ProductCategoryModelSchema = ProductCategorySchema.prefault({
  category: '',
  description: '',
});
export type ProductCategoryModel = z.infer<typeof ProductCategoryModelSchema>;

export const ProductUnitModelSchema = ProductUnitSchema.prefault({ shortName: '', description: '', disabled: false });
export type ProductUnitModel = z.infer<typeof ProductUnitModelSchema>;

export const JobsSettingsModelSchema = z.object({
  productCategories: ProductCategoryModelSchema.array(),
  productUnits: ProductUnitModelSchema.array(),
  jobRootPath: optionalString,
});
export type JobsSettingsModel = z.infer<typeof JobsSettingsModelSchema>;

export function validateJobsSettings(schema: SchemaPathTree<JobsSettingsModel>) {
  applyEach(schema.productCategories, (s) => {
    validateProductCategory(s);
  });
  applyEach(schema.productUnits, (s) => {
    validateProductUnit(s);
  });
}

export function validateProductCategory(schema: SchemaPathTree<ProductCategoryModel>) {
  required(schema.category);
  required(schema.description);
}

export function validateProductUnit(schema: SchemaPathTree<ProductUnitModel>) {
  required(schema.description);
  required(schema.shortName);
}
