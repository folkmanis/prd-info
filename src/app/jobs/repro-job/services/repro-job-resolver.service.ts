import { Injectable } from '@angular/core';
import { Route, Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form/simple-form-resolver.service';
import { Job } from 'src/app/interfaces';
import { JobService } from 'src/app/services/job.service';

@Injectable({
  providedIn: 'any'
})
export class ReproJobResolverService extends SimpleFormResolverService<Job> {

  constructor(
    router: Router,
    private jobsService: JobService,
  ) { super(router); }

  retrieveFn: RetrieveFn<Job> = (route) => {
    const id = +route.paramMap.get('id');
    if (isNaN(id)) { return EMPTY; }
    return this.jobsService.getJob(id);
  };
}
