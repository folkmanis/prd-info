import { z } from 'zod';

export const TransportationDriver = z.object({
  _id: z.string(),
  name: z.string(),
  disabled: z.boolean().default(false),
});
export type TransportationDriver = z.infer<typeof TransportationDriver>;

export const transportationDriverUpdate = TransportationDriver.partial().omit({ _id: true });
export type TransportationDriverUpdate = z.infer<typeof transportationDriverUpdate>;

export const transportationDriverCreate = TransportationDriver.omit({ _id: true });
export type TransportationDriverCreate = z.infer<typeof transportationDriverCreate>;

export function newTransportationDriver(): TransportationDriver {
  return {
    _id: '',
    name: '',
    disabled: false,
  };
}
