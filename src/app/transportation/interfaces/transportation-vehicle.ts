import { FuelType } from 'src/app/interfaces';
import { z } from 'zod';

export const TransportationVehicle = z.object({
  _id: z.string(),
  name: z.string(),
  licencePlate: z.string(),
  consumption: z.number(), // units
  fuelType: FuelType,
  disabled: z.boolean().default(false),
});
export type TransportationVehicle = z.infer<typeof TransportationVehicle>;

export const TransportationVehicleUpdate = TransportationVehicle.omit({
  _id: true,
}).partial();
export type TransportationVehicleUpdate = z.infer<typeof TransportationVehicleUpdate>;

export const TransportationVehicleCreate = TransportationVehicle.omit({
  _id: true,
});
export type TransportationVehicleCreate = z.infer<typeof TransportationVehicleCreate>;

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
