import { Injectable } from '@angular/core';
import { Route, Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form/simple-form-resolver.service';
import { JobBase } from 'src/app/interfaces';
import { JobService } from 'src/app/services/job.service';

@Injectable({
  providedIn: 'any'
})
export class ReproJobResolverService extends SimpleFormResolverService<Partial<JobBase>> {

  constructor(
    router: Router,
    private jobsService: JobService,
  ) { super(router); }


  retrieveFn: RetrieveFn<Partial<JobBase>> = (route) => {
    const id = route.paramMap.get('id');
    if (!isNaN(+id)) {
      return this.jobsService.getJob(+id);
    }
    if (id === 'newName') {
      return of({
        name: route.paramMap.get('name'),
        category: 'repro',
      });
    }
    return EMPTY;
  };
}
