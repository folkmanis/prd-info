import { facetFilterToQuery } from './facet-filter';
import { z } from 'zod';

const SearchFilterSchema = z.object({
  search: z.string(),
  facet: facetFilterToQuery,
});

const SearchQuerySchema = z
  .object({
    search: z.string(),
    customerName: z.string(),
    year: z.string(),
    month: z.string(),
  })
  .partial();

export const searchFilterToQuery = z.codec(SearchQuerySchema, SearchFilterSchema, {
  encode: ({ search, facet }) => ({
    search: search || undefined,
    ...facet,
  }),
  decode: ({ search, customerName, year, month }) => ({
    search: search ?? '',
    facet: {
      customerName,
      year,
      month,
    },
  }),
});

export type SearchFilter = z.output<typeof searchFilterToQuery>;
