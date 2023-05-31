import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Invoice } from 'src/app/interfaces';
import { InvoicesService } from '../services/invoices.service';

export const resolveInvoice: ResolveFn<Invoice> = (route) => {
  const invoiceId: string = route.paramMap.get('invoiceId');
  return inject(InvoicesService).getInvoice(invoiceId).pipe(
    mergeMap(invoice => invoice ? of(invoice) : EMPTY),
  );

};
