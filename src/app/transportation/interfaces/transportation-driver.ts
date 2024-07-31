import { Expose } from 'class-transformer';

export class TransportationDriver {
  @Expose({ name: '_id' })
  id: string;

  @Expose()
  name: string = '';

  @Expose()
  disabled: boolean = false;
}
