import { Expose } from 'class-transformer';
export interface ShippingAddressType {
  address: string;
  zip: string;
  country: string;
  paytraqId?: number;
  googleId?: string;
}

export class ShippingAddress implements ShippingAddressType {
  @Expose()
  address: string;

  @Expose()
  zip: string;

  @Expose()
  country: string;

  @Expose()
  paytraqId?: number;

  @Expose()
  googleId?: string;
}
