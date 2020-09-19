import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { concatMap, distinctUntilChanged, filter, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { JobBase, CustomerProduct } from 'src/app/interfaces';
import { DestroyService } from 'src/app/library/rx/destroy.service';
import { ProductsService } from 'src/app/services';
import { JobEditDialogData } from './job-edit-dialog-data';
import { IFormGroup, IFormControl } from '@rxweb/types';

@Component({
  selector: 'app-job-dialog',
  templateUrl: './job-dialog.component.html',
  styleUrls: ['./job-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class JobDialogComponent implements OnInit, OnDestroy {
  @ViewChild('accept', { read: ElementRef }) private acceptButton: ElementRef;

  jobForm: IFormGroup<JobBase>;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: JobEditDialogData,
    private dialogRef: MatDialogRef<JobDialogComponent>,
    private productsService: ProductsService,
    private chRef: ChangeDetectorRef,
    private destroy$: DestroyService,
  ) { }

  get customerContr() { return this.jobForm.controls.customer; }
  customerProducts$: Observable<CustomerProduct[]>;
  private _customer$: BehaviorSubject<string>;

  newJobId$: Observable<number> | undefined;

  /** Ctrl-Enter clicks the accept button */
  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey) {
      this.acceptButton.nativeElement.click();
    }
  }

  ngOnInit(): void {
    this.jobForm = this.data.jobForm;

    this._customer$ = new BehaviorSubject(this.customerContr.value as string);
    this.customerProducts$ = this._customer$.pipe(
      filter((customer: string) => !this.customerContr.invalid && customer && customer.length > 0),
      distinctUntilChanged(),
      switchMap((customer: string) => this.productsService.productsCustomer(customer)),
      shareReplay(1),
    );

    this.customerContr.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(this._customer$);

    if (!this.data.jobForm.get('jobId').value && typeof this.data.jobCreateFn === 'function') {
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
        takeUntil(this.destroy$),
      ).subscribe();
    }
  }

  ngOnDestroy(): void {
  }

}
