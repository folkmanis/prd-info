import { Injectable } from '@angular/core';
import { last } from 'lodash';
import { EMPTY, mergeMap, mergeMapTo, Observable, of } from 'rxjs';
import { Job, FileUploadEventType, FileUploadMessage } from '../interfaces';
import { ReproJobDialogService } from '../repro-jobs/services/repro-job-dialog.service';
import { JobService } from './job.service';
import { JobsApiService } from './jobs-api.service';


const MAX_JOB_NAME_LENGTH = 100; // TODO take from global config

export interface UserFile {
  name: string;
  size: number;
}


@Injectable({
  providedIn: 'root'
})
export class JobCreatorService {

  constructor(
    private jobDialog: ReproJobDialogService,
    private jobService: JobService,
    private jobsApi: JobsApiService,
  ) { }

  newJob(optionalJobParams: Partial<Job> = {}): Observable<Job> {
    const job = this.reproJobTemplate(optionalJobParams);
    return this.jobDialog.openJob(job).pipe(
      mergeMap(job => job ? this.jobService.newJob(job) : EMPTY),
    );
  }

  fromUserFiles(files: UserFile[], optionalJobParams: Partial<Job> = {}): Observable<Job> {

    const fileNames = files.map(file => file.name);

    const job = this.reproJobTemplate(optionalJobParams);
    if (!job.name) {
      job.name = this.jobNameFromFiles(fileNames);
    }

    const progress$ = of(files.map(file => this.uploadMessage(file)));

    return this.jobDialog.openJob(job, progress$).pipe(
      mergeMap(job => job ? this.jobService.newJob(job) : this.onAbort(fileNames)),
      mergeMap(({ jobId }) => this.jobService.moveUserFilesToJob(jobId, fileNames)),
    );

  }

  fromFtpFile(path: string[], optionalJobParams: Partial<Job> = {}): Observable<Job> {

    const fileName = last(path);

    const progress$ = of([this.uploadMessage({ name: fileName, size: 0 })]);

    const job = this.reproJobTemplate(optionalJobParams);
    if (!job.name) {
      job.name = this.jobNameFromFiles([fileName]);
    }

    return this.jobDialog.openJob(job, progress$).pipe(
      mergeMap(job => job ? of(job) : EMPTY),
      mergeMap(job => this.jobService.newJob(job)),
      mergeMap(({ jobId }) => this.jobService.copyFtpFilesToJob(jobId, [path])),
    );

  }

  private onAbort(fileNames: string[]): Observable<never> {
    return this.jobsApi.deleteUserFiles(fileNames).pipe(
      mergeMapTo(EMPTY),
    );
  }

  private reproJobTemplate(job: Partial<Job>): Partial<Job> {
    return {
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

  private jobNameFromFiles(fileNames: string[]): string {

    return fileNames
      .reduce((acc, curr) => [...acc, curr.replace(/\.[^/.]+$/, '')], [])
      .reduce((acc, curr, _, names) => [...acc, curr.slice(0, MAX_JOB_NAME_LENGTH / names.length)], [])
      .join('_');

  }

  private uploadMessage(file: UserFile): FileUploadMessage {
    return {
      type: FileUploadEventType.UploadFinish,
      id: file.name,
      name: file.name,
      size: file.size,
      fileNames: [file.name],
    };
  }


}
