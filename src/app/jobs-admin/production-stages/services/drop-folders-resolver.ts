import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';
import { FileElement, JobFilesService } from 'src/app/filesystem';

export const resolveDropFolders: ResolveFn<{ value: string[], name: string; }[]> = () =>
    inject(JobFilesService).dropFolders().pipe(
        map(dropFolderNames),
    );

function dropFolderNames(elements: FileElement[]): { value: string[], name: string; }[] {
    return elements
        .filter(el => el.isFolder)
        .map(el => ({
            value: [...el.parent, el.name],
            name: [...el.parent, el.name].join('/'),
        }));
}
