export class Attachment {
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
