import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ParamMap, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { endOfDay } from 'date-fns';
import { EMPTY, Observable, of } from 'rxjs';
import { concatMap, mergeMap, switchMap, tap } from 'rxjs/operators';
import { JobBase } from 'src/app/interfaces';
import { JobService } from 'src/app/services/job.service';
import { FileUploadService } from './file-upload.service';

interface SavedState {
  route: ActivatedRouteSnapshot;
  state: RouterStateSnapshot;
}

@Injectable({
  providedIn: 'root'
})
export class ReproJobService {

  constructor(
    private router: Router,
    private jobsService: JobService,
    private fileUploadService: FileUploadService,
  ) { }

  retrieveJob(paramMap: ParamMap): Observable<Partial<JobBase>> {
    const id = paramMap.get('jobId');
    if (!isNaN(+id)) {
      this.fileUploadService.setFiles([]);
      return this.getJob(+id);
    }
    return EMPTY;
  };

  getJob(jobId: number): Observable<JobBase> {
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

  insertJobAndUploadFiles(job: Partial<JobBase>): Observable<number> {
    const createFolder = !!this.fileUploadService.filesCount;
    return this.jobsService.newJob(job, { createFolder }).pipe(
      tap(jobId => this.fileUploadService.startUpload(jobId)),
    );
  }

  updateJob(job: Partial<JobBase>): Observable<boolean> {
    job = {
      ...job,
      dueDate: endOfDay(new Date(job.dueDate)),
    };
    return this.jobsService.updateJob(job).pipe(
      concatMap(resp => resp ? of(true) : EMPTY)
    );
  }

  createFolder(jobId: number): Observable<JobBase> {
    return this.jobsService.updateJob({ jobId }, { createFolder: true }).pipe(
      switchMap(resp => resp ? this.jobsService.getJob(jobId) : EMPTY),
    );
  }


}
