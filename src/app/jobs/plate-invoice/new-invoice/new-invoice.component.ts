import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, Select, Actions } from '@ngxs/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map, startWith, tap, take, shareReplay, switchMap, withLatestFrom } from 'rxjs/operators';
import { CustomerPartial, JobQueryFilter, Job, JobPartial, JobOneProduct, ProductTotals, InvoiceLike, Invoice } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';
import { InvoiceReport } from '../invoice-editor/invoice-report';
import { JobsState } from '../../store/jobs.state';
import { InvoicesState } from '../../store/invoices.state';
import * as JobsActions from '../../store/jobs.actions';
import * as InvoicesActions from '../../store/invoices.actions';

export interface InvoicesTotals {
  productTotals: ProductTotals[];
  grandTotal: number;
}

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewInvoiceComponent implements OnInit, OnDestroy {
  constructor(
    private customersService: CustomersService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
  ) { }

  selectedJobs: number[] | undefined;
  canSubmit = false;
  customerId = new FormControl('');

  customers$: Observable<CustomerPartial[]> = this.customersService.customers$;

  @Select(JobsState.jobs) jobs$: Observable<JobOneProduct[]>;

  @Select(InvoicesState.totals) totals$: Observable<InvoicesTotals>;

  @Select(InvoicesState.selectedInvoice) selectedInvoice$: Observable<Invoice>;

  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.customerId.valueChanges.pipe(
        startWith(''),
        map((customer: string) => ({ customer, unwindProducts: 1, invoice: 0 } as JobQueryFilter)),
        switchMap(filter => this.store.dispatch(new JobsActions.SetFilter(filter))),
      ).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onCreateInvoice() {
    this.store.dispatch(new InvoicesActions.CreateInvoice(this.customerId.value)).pipe(
      withLatestFrom(this.selectedInvoice$),
      map(([_, inv]) => inv.invoiceId),
    ).subscribe(id =>
      this.router.navigate(['../invoice', { invoiceId: id }], { relativeTo: this.route })
    );
  }

  onPrintList(jobs: Job[], customer: string, { productTotals, grandTotal }: InvoicesTotals) {
    const invoice: InvoiceLike = {
      customer,
      createdDate: new Date(Date.now()),
      jobs: jobs.filter(job => this.selectedJobs.some(id => id === job.jobId)),
      products: productTotals.map(tot => ({ ...tot, price: tot.total / tot.count, jobsCount: 0 })),
      total: grandTotal,
    };
    const report = new InvoiceReport(invoice);
    report.open();
  }

  onJobSelected(selectedJobs: number[]) {
    this.selectedJobs = selectedJobs;
    this.store.dispatch(new InvoicesActions.SetJobSelection(selectedJobs));
    setTimeout(() => {
      this.canSubmit = !!selectedJobs.length;
    }, 0);
  }

}
