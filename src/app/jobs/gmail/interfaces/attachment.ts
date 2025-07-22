import { z } from 'zod';

export const AttachmentSchema = z.object({
  filename: z.string().default('unnamed'),
  attachmentId: z.string(),
  size: z.number(),
});

export class Attachment implements z.infer<typeof AttachmentSchema> {
  get isPdf(): boolean {
    const extension = this.filename.slice(this.filename.lastIndexOf('.'));
    return extension.toLowerCase() === '.pdf';
  }

  constructor(
    public filename: string = 'unnamed',
    public attachmentId: string,
    public size: number,
  ) {}
}
