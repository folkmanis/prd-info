import { Injectable } from '@angular/core';
import { JobsApiService } from './jobs-api.service';
import { Job, JobPartial, JobQueryFilter, JobsWithoutInvoicesTotals, JobUnwindedPartial } from '../interfaces';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobFilesService {

  constructor(
    private api: JobsApiService,
  ) { }

  moveUserFilesToJob(jobId: number, fileNames: string[]): Observable<Job> {
    return this.api.transferUserfilesToJob(jobId, fileNames).pipe(
      // tap(() => this.reload()),
    );
  }

  copyFtpFilesToJob(jobId: number, files: string[][]): Observable<Job> {
    return this.api.transferFtpFilesToJob(jobId, files).pipe(
      // tap(() => this.reload()),
    );
  }

  updateFolderLocation(jobId: number) {
    return this.api.updateFilesLocation(jobId).pipe(
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  }


}
