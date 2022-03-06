import { Injectable } from '@angular/core';
import { EMPTY, mergeMap, mergeMapTo, Observable } from 'rxjs';
import { Job } from '../interfaces';
import { ReproJobDialogService } from '../repro-jobs/services/repro-job-dialog.service';
import { JobService } from './job.service';
import { JobsApiService } from './jobs-api.service';


const MAX_JOB_NAME_LENGTH = 100; // TODO take from global config


@Injectable({
  providedIn: 'root'
})
export class JobCreatorService {

  constructor(
    private jobDialog: ReproJobDialogService,
    private jobService: JobService,
    private jobsApi: JobsApiService,
  ) { }


  fromUserFiles(fileNames: string[], optionalJobParams: Partial<Job> = {}): Observable<Job> {

    const job = this.jobTemplateFromFiles(fileNames, optionalJobParams);

    return this.jobDialog.openJob(job).pipe(
      mergeMap(job => job ? this.jobService.newJob(job) : this.onAbort(fileNames)),
      mergeMap(jobId => this.jobService.moveUserFilesToJob(jobId, fileNames)),
    );

  }

  private onAbort(fileNames: string[]): Observable<never> {
    return this.jobsApi.deleteUserFiles(fileNames).pipe(
      mergeMapTo(EMPTY),
    );
  }

  private jobTemplateFromFiles(fileNames: string[], job: Partial<Job>): Partial<Job> {

    return {
      name: fileNames
        .reduce((acc, curr) => [...acc, curr.replace(/\.[^/.]+$/, '')], [])
        .reduce((acc, curr, _, names) => [...acc, curr.slice(0, MAX_JOB_NAME_LENGTH / names.length)], [])
        .join('_'),
      receivedDate: new Date(),
      dueDate: new Date(),
      production: {
        category: 'repro',
      },
      jobStatus: {
        generalStatus: 20,
        timestamp: new Date(),
      },
      ...job,
    };

  }


}
