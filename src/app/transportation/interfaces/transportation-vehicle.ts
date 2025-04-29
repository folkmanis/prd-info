import { fuelTypeSchema } from 'src/app/interfaces';
import { z } from 'zod';

export const transportationVehicleSchema = z.object({
  _id: z.string(),
  name: z.string(),
  licencePlate: z.string(),
  consumption: z.number(), // units
  fuelType: fuelTypeSchema,
  disabled: z.boolean().default(false),
});
export type TransportationVehicle = z.infer<typeof transportationVehicleSchema>;

export function newTransportationVehicle(): TransportationVehicle {
  return {
    _id: '',
    name: '',
    licencePlate: '',
    consumption: 0,
    fuelType: {
      type: '',
      description: '',
      units: '',
    },
    disabled: false,
  };
}
