import { Expose, Type } from 'class-transformer';
import { Customer, ShippingAddress } from 'src/app/interfaces';

export class TransportationCustomer implements NonNullable<Pick<Customer, '_id' | 'CustomerName' | 'shippingAddress'>> {
  @Expose()
  _id: string;

  @Expose()
  CustomerName: string;

  @Expose()
  @Type(() => ShippingAddress)
  shippingAddress: ShippingAddress;
}
