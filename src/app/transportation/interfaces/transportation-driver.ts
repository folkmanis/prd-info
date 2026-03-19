import { z } from 'zod';

export const TransportationDriverSchema = z.object({
  _id: z.string(),
  name: z.string(),
  disabled: z.boolean().default(false),
});
export type TransportationDriver = z.infer<typeof TransportationDriverSchema>;

export const transportationDriverUpdate = TransportationDriverSchema.partial().omit({ _id: true });
export type TransportationDriverUpdate = z.infer<typeof transportationDriverUpdate>;

export const transportationDriverCreate = TransportationDriverSchema.omit({ _id: true });
export type TransportationDriverCreate = z.infer<typeof transportationDriverCreate>;
