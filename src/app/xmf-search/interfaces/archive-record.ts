import { Type, Expose, Transform } from 'class-transformer';

export class Archive {
  @Expose({ name: 'Location' })
  @Transform(({ value }) => value.replace(/\//g, '\\'), { toClassOnly: true })
  location: string;

  @Expose({ name: 'Date' })
  date: string;

  @Expose({ name: 'Action' })
  action: number;
}

export class ArchiveRecord {
  @Expose({ name: 'JDFJobID' })
  jdfJobId: string;

  @Expose({ name: 'DescriptiveName' })
  descriptiveName: string;

  @Expose({ name: 'CustomerName' })
  customerName: string;

  @Expose({ name: 'Archives' })
  @Type(() => Archive)
  archives: Archive[];
}
