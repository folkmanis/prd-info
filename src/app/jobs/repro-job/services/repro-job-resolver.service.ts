import { Injectable } from '@angular/core';
import { Route, Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form/simple-form-resolver.service';
import { JobBase } from 'src/app/interfaces';
import { JobService } from 'src/app/services/job.service';
import { FileUploadService } from './file-upload.service';
import { mergeMap } from 'rxjs/operators';
import { log } from 'prd-cdk';

interface SavedState {
  route: ActivatedRouteSnapshot;
  state: RouterStateSnapshot;
}

@Injectable({
  providedIn: 'any'
})
export class ReproJobResolverService implements Resolve<Partial<JobBase>> {

  private savedState: SavedState | undefined;


  constructor(
    private router: Router,
    private fileUploadService: FileUploadService,
    private jobsService: JobService,
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Partial<JobBase>> | Observable<never> {
    this.savedState = { route, state };
    return this.retrieveFn(route).pipe(
      mergeMap(cust => {
        if (cust) {
          return of(cust);
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

  private retrieveFn(route: ActivatedRouteSnapshot): Observable<Partial<JobBase>> {
    const id = route.paramMap.get('jobId');
    if (!isNaN(+id)) {
      this.fileUploadService.setFiles([]);
      return this.jobsService.getJob(+id);
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

}
