import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable, combineLatest, merge, Subject, Subscription } from 'rxjs';
import { map, switchMap, filter, tap, takeUntil, share } from 'rxjs/operators';
import { CustomerPartial, Job } from '../../interfaces';
import { CustomersService, InvoicesService } from '../../services';
import { JobPartial, JobQueryFilter } from '../../interfaces';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.css']
})
export class NewInvoiceComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoicesService,
    private customersService: CustomersService,
  ) { }

  selectedJobs: number[] | undefined;
  canSubmit = false;
  customerId = new FormControl(null, { validators: Validators.required });

  customers$: Observable<CustomerPartial[]> = this.customersService.customers$;

  jobs$ = this.invoiceService.jobs$;
  totals$ = this.invoiceService.totals$;

  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    const _subs = this.customerId.valueChanges.pipe(
      map((customer: string) => ({ customer, unwindProducts: 1, invoice: 0 } as JobQueryFilter)),
    )
      .subscribe(this.invoiceService.filter$);
    this.subscriptions.add(_subs);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onCreateInvoice() {
    this.invoiceService.createInvoice({ selectedJobs: this.selectedJobs, customerId: this.customerId.value })
      .subscribe(id => console.log(id));
  }

  onJobSelected(selectedJobs: number[]) {
    this.selectedJobs = selectedJobs;
    this.invoiceService.totalsFilter$.next(selectedJobs);
    setTimeout(() => {
      this.canSubmit = !!selectedJobs.length;
    }, 0);
  }

}
