import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable, combineLatest, merge } from 'rxjs';
import { map, switchMap, filter, tap } from 'rxjs/operators';
import { CustomerPartial } from '../../interfaces';
import { JobService, JobPartial, CustomersService } from '../../services';

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
  ) { }

  invoiceForm: FormGroup = this.fb.group({
    customerId: [
      null,
      {
        validators: [Validators.required]
      }
    ],
    selectedJobs: [
      [],
      {
        validators: [
          Validators.required,
          this.isJobsSelected,
        ]
      }
    ],
  });

  get selectedJobs() { return this.invoiceForm.get('selectedJobs') as FormControl; }

  customers$: Observable<CustomerPartial[]> = this.customersService.customers$;

  newInvoice$: Observable<JobPartial[]> = this.route.paramMap.pipe(
    map(params => params.get('createNew')),
    filter(createNew => !!createNew),
    switchMap(() => this.invoiceForm.get('customerId').valueChanges as Observable<string>),
    switchMap(customer => this.jobService.getJobs({ customer, invoice: 0 })),
  );

  jobs$ = merge(this.newInvoice$);

  ngOnInit(): void {
  }

  onCreateInvoice() {
    this.jobService.createInvoice(this.invoiceForm.value)
      .subscribe(id => console.log(id));
  }

  onJobSelected(selectedJobs: JobPartial[]) {
    this.invoiceForm.patchValue({ selectedJobs });
  }

  private isJobsSelected(control: AbstractControl): ValidationErrors | null {
    const jobs: [] = control.value;
    return jobs.length ? null : { notSelected: 'Nav atzīmēts neviens darbs' };
  }

}
