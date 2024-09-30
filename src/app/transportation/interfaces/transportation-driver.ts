import { Expose } from 'class-transformer';

export class TransportationDriver {
  @Expose()
  _id: string;

  @Expose()
  name: string = '';

  @Expose()
  disabled: boolean = false;
}
