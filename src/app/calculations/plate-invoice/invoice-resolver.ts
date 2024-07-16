import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Invoice } from 'src/app/interfaces';
import { InvoicesService } from '../services/invoices.service';

export const resolveInvoice: ResolveFn<Invoice> = async (route) => {
  const invoicesService = inject(InvoicesService);
  const router = inject(Router);
  const invoiceId = route.paramMap.get('invoiceId');
  try {
    return await invoicesService.getInvoice(invoiceId);
  } catch (error) {
    const url = router.createUrlTree(['calculations', 'plate-invoice']);
    return new RedirectCommand(url);
  }
};
