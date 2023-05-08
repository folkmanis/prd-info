import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { JobUnwindedPartial } from 'src/app/jobs';
import { InvoicesService } from '../../services/invoices.service';

@Injectable({
  providedIn: 'root'
})
export class NewInvoiceJobsResolverService  {

  constructor(
    private invoicesService: InvoicesService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): JobUnwindedPartial[] | Observable<JobUnwindedPartial[]> | Promise<JobUnwindedPartial[]> {
    const customer = route.queryParamMap.get('customer') || '';
    return this.invoicesService.getJobsUnwinded({ customer, invoice: 0, limit: 1000 });
  }
}
