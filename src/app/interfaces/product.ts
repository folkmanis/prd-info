import { z } from 'zod';
import { ProductProductionStage } from './product-production-stage';

export const CustomerProduct = z.object({
  category: z.string(),
  description: z.string().nullish(),
  productName: z.string(),
  customerName: z.string().optional(),
  price: z.number().optional(),
  units: z.string(),
});
export type CustomerProduct = z.infer<typeof CustomerProduct>;

export const ProductPrice = z.object({
  customerName: z.string(),
  price: z.number(),
  lastUsed: z.coerce.date().nullable(),
});
export type ProductPrice = z.infer<typeof ProductPrice>;

export const Product = z.object({
  _id: z.string(),
  inactive: z.any().transform(Boolean),
  category: z.string(),
  name: z.string(),
  units: z.string().default(''),
  paytraqId: z.number().nullish(),
  description: z.string().nullish(),
  prices: z.array(ProductPrice).default([]),
  productionStages: z.array(ProductProductionStage).default([]),
});
export type Product = z.infer<typeof Product>;

export const ProductUpdate = Product.omit({
  _id: true,
}).partial();
export type ProductUpdate = z.infer<typeof ProductUpdate>;

export const ProductPartial = Product.pick({
  _id: true,
  name: true,
  category: true,
  inactive: true,
});
export type ProductPartial = z.infer<typeof ProductPartial>;

export const NewProduct = Product.omit({
  _id: true,
});
export type NewProduct = z.infer<typeof NewProduct>;

export const PriceChange = z.object({
  customerName: z.string(),
  price: z.number().optional(),
});
