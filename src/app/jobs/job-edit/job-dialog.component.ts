import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep, some } from 'lodash';

import { PlateJobEditorComponent } from './plate-job-editor/plate-job-editor.component';
import { Job, CustomerProduct } from 'src/app/interfaces';
import { JobEditDialogData } from './job-edit-dialog-data';
import { Observable, merge, of, BehaviorSubject } from 'rxjs';
import { tap, map, filter, take, switchMap, shareReplay } from 'rxjs/operators';
import { FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors, FormGroup, FormControl } from '@angular/forms';
import { CustomersService, ProductsService } from 'src/app/services';

@Component({
  selector: 'app-job-dialog',
  templateUrl: './job-dialog.component.html',
  styleUrls: ['./job-dialog.component.css']
})
export class JobDialogComponent implements OnInit {
  jobForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: JobEditDialogData,
    private dialogRef: MatDialogRef<JobDialogComponent>,
    private snack: MatSnackBar,
    private productsService: ProductsService,
  ) {
    this.jobForm = this.data.jobForm;
  }

  get customerContr(): FormControl { return this.jobForm.get('customer') as FormControl; }
  customerProducts$: Observable<CustomerProduct[]>;

  newJobId$: Observable<number> | undefined;

  ngOnInit(): void {
    this.customerProducts$ =
      merge(
        of(this.customerContr.value as string),
        this.customerContr.valueChanges.pipe(
          filter(() => this.customerContr.valid)
        )
      ).pipe(
        filter((customer: string) => customer && customer.length > 0),
        switchMap((customer: string) => this.productsService.productsCustomer(customer)),
        shareReplay(1),
      );
  }

  onCopy(value: string) {
    this.snack.open(`${value} izkopēts!`, 'OK', { duration: 2000 });
  }


}
