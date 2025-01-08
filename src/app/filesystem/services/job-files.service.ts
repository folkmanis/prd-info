import { HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { last } from 'lodash-es';
import { map, Observable, tap } from 'rxjs';
import { JobsFilesApiService } from 'src/app/filesystem';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { Job } from '../../jobs';
import { FileElement } from '../interfaces/file-element';
import { FileLocationTypes } from '../interfaces/file-location-types';

@Injectable({
  providedIn: 'root',
})
export class JobFilesService {
  private filesApi = inject(JobsFilesApiService);
  private sanitize = inject(SanitizeService);

  moveUserFilesToJob(jobId: number, fileNames: string[]): Observable<Job> {
    return this.filesApi.transferUserfilesToJob(jobId, fileNames);
  }

  copyFtpFilesToJob(jobId: number, files: string[][]): Observable<Job> {
    return this.filesApi.transferFtpFilesToJob(jobId, files);
  }

  async updateFolderLocation(jobId: number): Promise<Job> {
    return this.filesApi.updateFilesLocation(jobId);
  }

  uploadUserFile(file: File, name?: string): Observable<HttpEvent<{ names: string[] }>> {
    const formData = new FormData();
    name = this.sanitize.sanitizeFileName(name || file.name);

    formData.append('fileUpload', file, name);

    return this.filesApi.userFileUpload(formData);
  }

  deleteUserUploads(fileNames: string[]): Observable<null> {
    return this.filesApi.deleteUserFiles(fileNames).pipe(
      tap((count) => {
        if (count !== fileNames.length) {
          throw new Error('Not all uploads deleted');
        }
      }),
      map(() => null),
    );
  }

  ftpFolders(path?: string[]): Promise<FileElement[]> {
    return this.filesApi.readFtp(path?.join('/'));
  }

  async dropFolders(path?: string[]): Promise<FileElement[]> {
    return this.filesApi.readDropFolders(path?.join('/'));
  }

  copyJobFolderToDropFolder(path: string[], dropFolder: string[]): Observable<number> {
    const dstPath = dropFolder.join('/') + '/' + last(path);
    return this.filesApi.copyFile(FileLocationTypes.JOB, FileLocationTypes.DROPFOLDER, path.join('/'), dstPath);
  }

  copyJobFilesToJobFiles(oldJobId: number, newJobId: number): Observable<Job> {
    return this.filesApi.copyFromJobToJob(oldJobId, newJobId);
  }
}
