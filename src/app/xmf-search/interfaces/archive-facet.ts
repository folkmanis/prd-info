import { z } from 'zod';

export const FacetCountSchema = z.object({
  _id: z.union([z.string(), z.number()]).nullable(),
  count: z.number().int(),
});
export type FacetCount = z.infer<typeof FacetCountSchema>;

export const ArchiveFacetSchema = z.object({
  customerName: z.array(FacetCountSchema),
  year: z.array(FacetCountSchema),
  month: z.array(FacetCountSchema),
});
export type ArchiveFacet = z.infer<typeof ArchiveFacetSchema>;
