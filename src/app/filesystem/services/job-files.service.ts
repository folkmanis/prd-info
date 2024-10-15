import { HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap, map } from 'rxjs';
import { JobsFilesApiService } from 'src/app/filesystem';
import { Job } from '../../jobs';
import { FileElement } from '../interfaces/file-element';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { FileLocationTypes } from '../interfaces/file-location-types';
import { last } from 'lodash-es';

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

  async updateFolderLocation(jobId: number): Promise<string[]> {
    return this.filesApi.updateFilesLocation(jobId);
  }

  listJobFolder(path: string[]): Observable<FileElement[]> {
    return this.filesApi.readJobFolder(path);
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

  dropFolders(path?: string[]): Observable<FileElement[]> {
    return this.filesApi.readDropFolders(path?.join('/'));
  }

  copyJobFolderToDropFolder(path: string[], dropFolder: string[]): Observable<number> {
    const dstPath = dropFolder.join('/') + '/' + last(path);
    return this.filesApi.copyFile(FileLocationTypes.JOB, FileLocationTypes.DROPFOLDER, path.join('/'), dstPath);
  }
}
