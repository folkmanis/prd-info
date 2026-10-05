import { HttpEvent, HttpResourceRef } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { last } from 'lodash-es';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { JobsFilesApiService, PathFilter } from 'src/app/filesystem';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { Job } from '../../jobs';
import { FileElement } from '../interfaces/file-element';
import { FileLocationTypes } from '../interfaces/file-location-types';
import { FilterInput, toFilterSignal } from 'src/app/library';

@Service()
export class JobFilesService {
  #api = inject(JobsFilesApiService);
  #sanitize = inject(SanitizeService);

  moveUserFilesToJob(jobId: number, fileNames: string[]): Observable<Job> {
    return this.#api.transferUserfilesToJob(jobId, fileNames);
  }

  copyFtpFilesToJob(jobId: number, files: string[][]): Observable<Job> {
    return this.#api.transferFtpFilesToJob(jobId, files);
  }

  async updateFolderLocation(jobId: number): Promise<Job> {
    return this.#api.updateFilesLocation(jobId);
  }

  uploadUserFile(file: File, name?: string): Observable<HttpEvent<{ names: string[] }>> {
    const formData = new FormData();
    name = this.#sanitize.sanitizeFileName(name || file.name);

    formData.append('fileUpload', file, name);

    return this.#api.userFileUpload(formData);
  }

  deleteUserUploads(fileNames: string[]): Observable<null> {
    return this.#api.deleteUserFiles(fileNames).pipe(
      tap((count) => {
        if (count !== fileNames.length) {
          throw new Error('Not all uploads deleted');
        }
      }),
      map(() => null),
    );
  }

  ftpFolders(path?: string[]): Observable<FileElement[]> {
    return this.#api.readFtp(path?.join('/'));
  }

  dropFoldersResource(filter?: FilterInput<PathFilter>): HttpResourceRef<FileElement[] | undefined> {
    return this.#api.dropFoldersResource(toFilterSignal(filter));
  }

  copyJobFolderToDropFolder(path: string[], dropFolder: string[]): Promise<number> {
    const dstPath = dropFolder.join('/') + '/' + last(path);
    return firstValueFrom(
      this.#api.copyFile(FileLocationTypes.JOB, FileLocationTypes.DROPFOLDER, path.join('/'), dstPath),
    );
  }

  copyJobFilesToJobFiles(oldJobId: number, newJobId: number): Observable<Job> {
    return this.#api.copyFromJobToJob(oldJobId, newJobId);
  }
}
