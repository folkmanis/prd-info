import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable, combineLatest, merge } from 'rxjs';
import { map, switchMap, filter, tap, share } from 'rxjs/operators';
import { JobService, CustomersService, InvoicesService } from '../../services';
import {CustomerPartial, JobPartial, Invoice, Job } from 'src/app/interfaces';
import { InvoiceReport } from './invoice-report';

@Component({
  selector: 'app-invoice-editor',
  templateUrl: './invoice-editor.component.html',
  styleUrls: ['./invoice-editor.component.css']
})
export class InvoiceEditorComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private jobService: JobService,
    private customersService: CustomersService,
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
    // window.open('/data/invoices/' + invoiceId + '/report', '_blank');
    // this.invoicesService.getInvoice(invoiceId).pipe(
    //   tap(resp => console.log('download pdf', invoiceId, resp)),
    // ).subscribe();

  }

}
