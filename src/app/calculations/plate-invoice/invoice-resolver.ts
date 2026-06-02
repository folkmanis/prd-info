import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { InvoiceForReport } from 'src/app/interfaces';
import { notNullOrThrow } from 'src/app/library';
import { resolveCatching } from 'src/app/library/guards';
import { InvoicesService } from '../services/invoices.service';

export const resolveInvoice: ResolveFn<InvoiceForReport> = (route) => {
  const invoicesService = inject(InvoicesService);

  const invoiceId = notNullOrThrow(route.paramMap.get('invoiceId'));

  return resolveCatching('calculations/plate-invoice/', () => invoicesService.getInvoice(invoiceId));
};
