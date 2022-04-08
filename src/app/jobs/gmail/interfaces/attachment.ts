export class Attachment {

    get isPdf(): boolean {
        return this.filename.slice(this.filename.lastIndexOf('.')) === '.pdf';
    }

    constructor(
        public filename: string = 'unnamed',
        public attachmentId: string,
        public size: number,
    ) { }

}
