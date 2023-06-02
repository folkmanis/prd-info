import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { JobsWithoutInvoicesTotals } from 'src/app/jobs';
import { InvoicesService } from '../services/invoices.service';


export const resolveCustomers: ResolveFn<JobsWithoutInvoicesTotals[]> = () =>
    inject(InvoicesService).getJobsWithoutInvoicesTotals();