import { HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, map } from 'rxjs';
import { JobsFilesApiService } from 'src/app/filesystem';
import { Job } from '../../jobs';
import { FileElement } from '../interfaces/file-element';
import { SanitizeService } from 'src/app/library/services/sanitize.service';


@Injectable({
  providedIn: 'root'
})
export class JobFilesService {

  constructor(
    private filesApi: JobsFilesApiService,
    private sanitize: SanitizeService,
  ) { }

  moveUserFilesToJob(jobId: number, fileNames: string[]): Observable<Job> {
    return this.filesApi.transferUserfilesToJob(jobId, fileNames);
  }

  copyFtpFilesToJob(jobId: number, files: string[][]): Observable<Job> {
    return this.filesApi.transferFtpFilesToJob(jobId, files);
  }

  updateFolderLocation(jobId: number) {
    return this.filesApi.updateFilesLocation(jobId).pipe(
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  }

  listJobFolder(jobId: number): Observable<FileElement[]> {
    return this.filesApi.readJobFolder(jobId);
  }

  uploadUserFile(file: File, name?: string): Observable<HttpEvent<{ names: string[]; }>> {

    const formData = new FormData();
    name = this.sanitize.sanitizeFileName(name || file.name);

    formData.append('fileUpload', file, name);

    return this.filesApi.userFileUpload(formData);

  }

  deleteUserUploads(fileNames: string[]): Observable<null> {
    return this.filesApi.deleteUserFiles(fileNames).pipe(
      tap(count => {
        if (count !== fileNames.length) {
          throw new Error('Not all uploads deleted');
        }
      }),
      map(() => null),
    );
  }



}