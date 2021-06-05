import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JobBase } from 'src/app/interfaces';
import { JobService } from 'src/app/services/job.service';
import { FileUploadService } from './file-upload.service';

@Injectable({
  providedIn: 'any'
})
export class ReproJobService {

  constructor(
    private jobsService: JobService,
    private fileUploadService: FileUploadService,
  ) { }

  getJob(jobId: number): Observable<JobBase> | Observable<never> {
    this.fileUploadService.setFiles([]);
    return this.jobsService.getJob(jobId);
  }

  newJob(name?: string): Observable<Partial<JobBase>> {
    return of({
      name,
      category: 'repro',
      jobStatus: {
        generalStatus: 20
      }
    });

  }
}
