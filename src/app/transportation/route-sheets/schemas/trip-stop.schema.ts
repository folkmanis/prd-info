import { z } from 'zod';

export const RouteTripStopSchema = z.object({
  customerId: z.string().optional(),
  name: z.string().nonempty(),
  address: z.string().nonempty(),
  googleLocationId: z.string().optional(),
});
export type RouteTripStop = z.infer<typeof RouteTripStopSchema>;
