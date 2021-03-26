import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Customer, CustomerPartial, Job, JobPartial, JobQueryFilter } from 'src/app/interfaces';
import { Observable, EMPTY } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { log } from 'prd-cdk';
import { JobService } from 'src/app/services/job.service';
import { CustomersService } from 'src/app/services/customers.service';

@Injectable({
  providedIn: 'root'
})
export class JobPricesResolverService implements Resolve<JobPartial[]> {

  constructor(
    private jobService: JobService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<JobPartial[]> {
    const customerName = route.paramMap.get('customer') || 'all';
    const filter: JobQueryFilter = {
      invoice: 0, 
      unwindProducts: 1,
      customer: customerName === 'all' ? undefined : customerName
    }
    this.jobService.setFilter(filter);
    return this.jobService.jobs$.pipe(
      take(1),
    );

  }
}
