import { FuelTypeInterface } from './fuel-type.interface';
import { ShippingAddress } from './shipping-address';

export interface TransportationSettings {
  shippingAddress: ShippingAddress | null;
  fuelTypes: FuelTypeInterface[];
}
