import { FuelType } from './fuel-type';
import { ShippingAddress } from './shipping-address';

export interface TransportationSettings {
  shippingAddress: ShippingAddress | null;
  fuelTypes: FuelType[];
}
