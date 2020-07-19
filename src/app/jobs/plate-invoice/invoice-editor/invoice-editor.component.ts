import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap, shareReplay } from 'rxjs/operators';
import { Invoice, InvoiceLike } from 'src/app/interfaces';
import { InvoicesService } from '../../services/invoices.service';
import { CustomersService } from 'src/app/services/customers.service';
import { InvoiceReport } from './invoice-report';

@Component({
  selector: 'app-invoice-editor',
  templateUrl: './invoice-editor.component.html',
  styleUrls: ['./invoice-editor.component.css']
})
export class InvoiceEditorComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private invoicesService: InvoicesService,
    private customersService: CustomersService,
  ) { }

  invoice$: Observable<InvoiceLike> = this.route.paramMap.pipe(
    map(params => params.get('invoiceId') as string | undefined),
    filter(invoiceId => !!invoiceId),
    switchMap(invoiceId => this.invoicesService.getInvoice(invoiceId)),
    switchMap(invoice => this.customersService.getCustomerByName(invoice.customer).pipe(
      map(customer => ({ ...invoice, financial: customer.financial })),
    )),
    map(invoice => ({
      ...invoice,
      total: invoice.products.reduce((acc, curr) => acc + curr.total, 0)
    })),
  );

  ngOnInit(): void {
  }

  onPdfDownload(invoice: Invoice): void {
    const report = new InvoiceReport(invoice);
    report.open();
  }

}
