import { KeysMap } from 'src/app/library';
import { z } from 'zod/v4';

export const archiveRecordKeysMap: KeysMap = {
  JDFJobID: 'jdfJobId',
  DescriptiveName: 'descriptiveName',
  CustomerName: 'customerName',
  Archives: {
    name: 'archives',
    keysMap: {
      Location: 'location',
      Date: 'date',
      Action: 'action',
    },
  },
};

export const Archive = z.object({
  location: z.string().transform((val) => val.replace(/\//g, '\\')),
  date: z.string(),
  action: z.number(),
});
export type Archive = z.infer<typeof Archive>;

export const ArchiveRecord = z.object({
  jdfJobId: z.string(),
  descriptiveName: z.string(),
  customerName: z.string(),
  archives: z.array(Archive),
});
export type ArchiveRecord = z.infer<typeof ArchiveRecord>;
