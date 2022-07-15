import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { JobsFilesApiService } from 'src/app/filesystem';
import { Job } from '../../jobs';
import { FileElement } from '../interfaces/file-element';

@Injectable({
  providedIn: 'root'
})
export class JobFilesService {

  constructor(
    private filesApi: JobsFilesApiService,
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

  jobFolder(jobId: number): Observable<FileElement[]> {
    return this.filesApi.readJobFolder(jobId);
  }


}
