import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Invoice } from 'src/app/interfaces';
import { InvoicesService } from '../../services';
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
  ) { }

  invoice$: Observable<Invoice> = this.route.paramMap.pipe(
    map(params => params.get('invoiceId') as string | undefined),
    filter(invoiceId => !!invoiceId),
    switchMap(invoiceId => this.invoicesService.getInvoice(invoiceId)),
  );

  ngOnInit(): void {
  }

  onPdfDownload(invoice: Invoice): void {
    const report = new InvoiceReport(invoice);
    report.open();
  }

}
