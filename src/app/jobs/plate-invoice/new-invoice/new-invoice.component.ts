import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable, combineLatest, merge, Subject } from 'rxjs';
import { map, switchMap, filter, tap, takeUntil } from 'rxjs/operators';
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

  selectedJobs: JobPartial[] | undefined;
  canSubmit = false;
  customerId = new FormControl(null, { validators: Validators.required });

  customers$: Observable<CustomerPartial[]> = this.customersService.customers$;

  jobs$ = this.invoiceService.jobs$;

  private readonly _unsubs = new Subject<void>();

  ngOnInit(): void {
    this.customerId.valueChanges.pipe(
      takeUntil(this._unsubs),
      map((customer: string) => ({ customer, unwindProducts: 1, invoice: 0 } as JobQueryFilter)),
    )
      .subscribe(this.invoiceService.filter$);
  }

  ngOnDestroy(): void {
    this._unsubs.next();
  }

  onCreateInvoice() {
    this.invoiceService.createInvoice({ selectedJobs: this.selectedJobs.map(job => job.jobId), customerId: this.customerId.value })
      .subscribe(id => console.log(id));
  }

  onJobSelected(selectedJobs: JobPartial[]) {
    this.selectedJobs = selectedJobs;
    setTimeout(() => {
      this.canSubmit = !!selectedJobs.length;
    }, 0);
  }

}
