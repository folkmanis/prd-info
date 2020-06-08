import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerPartial, JobQueryFilter } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';
import { InvoicesService } from '../../services';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.css']
})
export class NewInvoiceComponent implements OnInit, OnDestroy {
  constructor(
    private invoiceService: InvoicesService,
    private customersService: CustomersService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  selectedJobs: number[] | undefined;
  canSubmit = false;
  customerId = new FormControl(null, { validators: Validators.required });

  customers$: Observable<CustomerPartial[]> = this.customersService.customers$;

  jobs$ = this.invoiceService.jobs$;
  totals$ = this.invoiceService.totals$;
  grandTotal$ = this.invoiceService.grandTotal$;

  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    const _subs = this.customerId.valueChanges.pipe(
      map((customer: string) => ({ customer, unwindProducts: 1, invoice: 0 } as JobQueryFilter)),
    )
      .subscribe(this.invoiceService.jobFilter$);
    this.subscriptions.add(_subs);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onCreateInvoice() {
    this.invoiceService.createInvoice({ selectedJobs: this.selectedJobs, customerId: this.customerId.value })
      .subscribe(id => this.router.navigate(['../invoice', { invoiceId: id.invoiceId }], { relativeTo: this.route }));
  }

  onJobSelected(selectedJobs: number[]) {
    this.selectedJobs = selectedJobs;
    this.invoiceService.totalsFilter$.next(selectedJobs);
    setTimeout(() => {
      this.canSubmit = !!selectedJobs.length;
    }, 0);
  }

}
