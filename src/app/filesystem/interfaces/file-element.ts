import { Expose } from 'class-transformer';

export class FileElement {

    @Expose()
    id?: string | null = null;

    @Expose()
    isFolder: boolean = false;

    @Expose()
    name: string;

    @Expose()
    parent: string[] = [];

}
