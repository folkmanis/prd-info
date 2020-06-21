import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep, some } from 'lodash';

import { PlateJobEditorComponent } from './plate-job-editor/plate-job-editor.component';
import { Job, CustomerProduct } from 'src/app/interfaces';
import { JobEditDialogData } from './job-edit-dialog-data';
import { Observable, merge, of, BehaviorSubject, Subscription } from 'rxjs';
import { tap, map, filter, take, switchMap, shareReplay, concatMap, distinctUntilChanged } from 'rxjs/operators';
import { FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors, FormGroup, FormControl } from '@angular/forms';
import { CustomersService, ProductsService } from 'src/app/services';

@Component({
  selector: 'app-job-dialog',
  templateUrl: './job-dialog.component.html',
  styleUrls: ['./job-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobDialogComponent implements OnInit, OnDestroy {
  jobForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: JobEditDialogData,
    private dialogRef: MatDialogRef<JobDialogComponent>,
    private snack: MatSnackBar,
    private productsService: ProductsService,
    private chRef: ChangeDetectorRef,
  ) {
    this.jobForm = this.data.jobForm;
  }

  get customerContr(): FormControl { return this.jobForm.get('customer') as FormControl; }
  customerProducts$: Observable<CustomerProduct[]>;
  private _customer$: BehaviorSubject<string>;
  private readonly _subs = new Subscription();

  newJobId$: Observable<number> | undefined;

  ngOnInit(): void {
    this._customer$ = new BehaviorSubject(this.customerContr.value as string);
    this.customerProducts$ = this._customer$.pipe(
      filter((customer: string) => !this.customerContr.invalid && customer && customer.length > 0),
      distinctUntilChanged(),
      switchMap((customer: string) => this.productsService.productsCustomer(customer)),
      shareReplay(1),
    );
    this._subs.add(this.customerContr.valueChanges.subscribe(this._customer$));

    if (!this.data.jobForm.get('jobId').value && typeof this.data.jobCreateFn === 'function') {
      this._subs.add(
        this.customerContr.valueChanges.pipe(
          filter(() => this.customerContr.valid),
          map(cust => ({
            customer: cust,
            name: this.jobForm.value.name || 'Jauns darbs',
            jobStatus: {
              generalStatus: this.jobForm.value.jobStatus.generalStatus
            }
          })),
          concatMap(this.data.jobCreateFn),
          tap(jobId =>
            jobId ? this.jobForm.patchValue({ jobId, jobStatus: { generalStatus: 20 } }) : this.dialogRef.close()
          ),
          tap(() => this.chRef.markForCheck()),
        ).subscribe()
      );
    }
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  onCopy(value: string) {
    this.snack.open(`${value} izkopēts!`, 'OK', { duration: 2000 });
  }


}
