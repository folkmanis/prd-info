import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable, combineLatest, merge } from 'rxjs';
import { map, switchMap, filter, tap } from 'rxjs/operators';
import { CustomerPartial, Job } from '../../interfaces';
import { JobService, JobPartial, CustomersService } from '../../services';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.css']
})
export class NewInvoiceComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private customersService: CustomersService,
  ) { }

  selectedJobs: JobPartial[] | undefined;
  canSubmit = false;
  customerId = new FormControl(null, { validators: Validators.required });

  customers$: Observable<CustomerPartial[]> = this.customersService.customers$;

  newInvoice$: Observable<JobPartial[]> = this.customerId.valueChanges.pipe(
    switchMap(customer => this.jobService.getJobs({ customer, invoice: 0 })),
  );
  jobs$ = merge(this.newInvoice$);

  ngOnInit(): void {
  }

  onCreateInvoice() {
    this.jobService.createInvoice({ selectedJobs: this.selectedJobs, customerId: this.customerId.value })
      .subscribe(id => console.log(id));
  }

  onJobSelected(selectedJobs: JobPartial[]) {
    this.selectedJobs = selectedJobs;
    setTimeout(() => {
      this.canSubmit = !!selectedJobs.length;
    }, 0);
  }

}
