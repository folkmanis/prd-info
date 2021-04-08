import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Customer, CustomerPartial, Job, JobPartial, JobQueryFilter, JobProduct } from 'src/app/interfaces';
import { Observable, EMPTY, ReplaySubject, BehaviorSubject } from 'rxjs';
import { tap, map, take, withLatestFrom } from 'rxjs/operators';
import { log } from 'prd-cdk';
import { JobService } from 'src/app/services/job.service';
import { CustomersService } from 'src/app/services/customers.service';

export class Filter {
  constructor(
    public name: string = '',
    public noPrice: boolean = false,
  ) { }

  get routeParams(): Pick<Filter, 'noPrice'> {
    return {
      noPrice: this.noPrice,
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class JobPricesResolverService implements Resolve<JobPartial[]> {

  private readonly _filter$ = new BehaviorSubject<Filter>(new Filter());
  filter$ = this._filter$.asObservable();

  constructor(
    private jobService: JobService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<JobPartial[]> {
    const filter = new Filter(
      route.paramMap.get('customer') || 'all',
      route.paramMap.get('noPrice') === 'true',
    );
    this._filter$.next(filter);

    return this.jobService.getJobList({
      invoice: 0,
      unwindProducts: 1,
      customer: filter.name === 'all' ? undefined : filter.name
    }).pipe(
      map(jobs => this.filterJobs(jobs, filter)),
    );
  }

  private filterJobs(jobs: JobPartial[], filter: Filter): JobPartial[] {
    return filter.noPrice ? jobs.filter(jb => !(jb.products as JobProduct)?.price) : jobs;
  }

}
