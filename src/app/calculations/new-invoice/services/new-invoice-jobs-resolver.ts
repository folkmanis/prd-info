import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { JobUnwindedPartial } from 'src/app/jobs';
import { InvoicesService } from '../../services/invoices.service';

export const resolveNewInvoiceJobs: ResolveFn<JobUnwindedPartial[]> = (route) => {
  const customer = route.queryParamMap.get('customer') || '';
  return inject(InvoicesService).getJobsUnwinded({ customer, invoice: 0, limit: 1000 });
};
