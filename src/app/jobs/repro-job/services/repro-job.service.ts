import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
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
export class ReproJobService implements Resolve<Partial<JobBase>>{

  private savedState: SavedState | undefined;

  constructor(
    private router: Router,
    private jobsService: JobService,
    private fileUploadService: FileUploadService,
  ) { }


  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Partial<JobBase>> | Observable<never> {
    this.savedState = { route, state };
    return this.retrieveJob(route).pipe(
      mergeMap(data => {
        if (data) {
          return of(data);
        } else {
          this.cancelNavigation(state);
          return EMPTY;
        }
      })
    );
  }

  reload(): Observable<Partial<JobBase>> | Observable<never> {
    if (!this.savedState) { return EMPTY; }
    const { route, state } = this.savedState;
    return this.resolve(route, state);
  }

  private retrieveJob(route: ActivatedRouteSnapshot): Observable<Partial<JobBase>> {
    const id = route.paramMap.get('jobId');
    if (!isNaN(+id)) {
      this.fileUploadService.setFiles([]);
      return this.getJob(+id);
    }
    if (id === 'newName') {
      return of({
        name: route.paramMap.get('name'),
        category: 'repro',
        jobStatus: {
          generalStatus: 20
        }
      });
    }
    return EMPTY;
  };

  private cancelNavigation(state: RouterStateSnapshot) {
    this.router.navigate(state.url.split('/').slice(0, -1));
  }


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

  insertJob(job: JobBase): Observable<number> {
    const createFolder = !!this.fileUploadService.filesCount;
    return this.jobsService.newJob(job, { createFolder }).pipe(
      tap(jobId => this.fileUploadService.startUpload(jobId)),
    );
  }

  updateJob(job: JobBase): Observable<boolean> {
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
