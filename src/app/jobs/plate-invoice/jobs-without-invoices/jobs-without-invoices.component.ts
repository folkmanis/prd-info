import { Component, OnInit } from '@angular/core';
import { InvoicesService } from '../../services/invoices.service';

@Component({
  selector: 'app-jobs-without-invoices',
  templateUrl: './jobs-without-invoices.component.html',
  styleUrls: ['./jobs-without-invoices.component.scss']
})
export class JobsWithoutInvoicesComponent implements OnInit {

  constructor(
    private invoicesService: InvoicesService,
  ) { }

  noInvoices$ = this.invoicesService.jobsWithoutInvoicesTotals$;

  ngOnInit(): void {
  }

}
