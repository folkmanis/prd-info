import { z } from 'zod';

const FacetFilterSchema = z
  .object({
    customerName: z.array(z.string()),
    year: z.array(z.number()),
    month: z.array(z.number()),
  })
  .partial();

const FacetQuerySchema = z
  .object({
    customerName: z.string(),
    year: z.string(),
    month: z.string(),
  })
  .partial();

export const facetFilterToQuery = z.codec(FacetQuerySchema, FacetFilterSchema, {
  encode: (filter) => ({
    customerName: filter.customerName?.join(','),
    year: filter.year?.join(','),
    month: filter.month?.join(','),
  }),
  decode: (query) => ({
    customerName: query.customerName?.split(','),
    year: query.year?.split(',')?.map((y) => Number.parseInt(y)),
    month: query.month?.split(',')?.map((y) => Number.parseInt(y)),
  }),
});

export type FacetFilter = z.output<typeof facetFilterToQuery>;
export type FacetQuery = z.input<typeof facetFilterToQuery>;
