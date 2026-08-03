import { z } from 'zod';
import { ProductProductionStage } from './product-production-stage';

export const CustomerProductSchema = z.object({
  category: z.string(),
  description: z.string().nullish(),
  productName: z.string(),
  customerName: z.string().optional(),
  price: z.number().optional(),
  units: z.string(),
});
export type CustomerProduct = z.infer<typeof CustomerProductSchema>;

export const ProductPriceSchema = z.object({
  customerName: z.string(),
  price: z.number(),
  lastUsed: z.coerce.date().optional(),
});
export type ProductPrice = z.infer<typeof ProductPriceSchema>;

export const ProductSchema = z.object({
  _id: z.string(),
  inactive: z.coerce.boolean().default(false),
  category: z.string(),
  name: z.string(),
  units: z.string().default(''),
  paytraqId: z.number().nullish(),
  description: z.string().nullish(),
  prices: z.array(ProductPriceSchema).default([]),
  productionStages: z.array(ProductProductionStage).default([]),
});
export type Product = z.infer<typeof ProductSchema>;

export const ProductUpdate = ProductSchema.omit({
  _id: true,
}).partial();
export type ProductUpdate = z.infer<typeof ProductUpdate>;

export const ProductPartial = ProductSchema.pick({
  _id: true,
  name: true,
  category: true,
  inactive: true,
});
export type ProductPartial = z.infer<typeof ProductPartial>;

export const NewProduct = ProductSchema.omit({
  _id: true,
});
export type NewProduct = z.infer<typeof NewProduct>;

export const PriceChange = z.object({
  customerName: z.string(),
  price: z.number().optional(),
});
