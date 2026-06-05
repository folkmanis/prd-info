import { z } from 'zod';

export const Archive = z.object({
  location: z.string(),
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
