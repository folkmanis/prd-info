import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFormGroup } from '@rxweb/types';
import { Observable } from 'rxjs';
import { concatMap, filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { CustomerProduct, JobBase } from 'src/app/interfaces';
import { DestroyService } from 'src/app/library/rx/destroy.service';
import { JobEditDialogData } from './job-edit-dialog-data';
import { JobEditFormService } from './services/job-edit-form.service';

@Component({
  selector: 'app-job-dialog',
  templateUrl: './job-dialog.component.html',
  styleUrls: ['./job-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService, JobEditFormService]
})
export class JobDialogComponent implements OnInit, OnDestroy {
  @ViewChild('accept', { read: ElementRef }) private acceptButton: ElementRef;

  jobForm: IFormGroup<JobBase>;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: JobEditDialogData,
    private dialogRef: MatDialogRef<JobDialogComponent>,
    private chRef: ChangeDetectorRef,
    private destroy$: DestroyService,
    private jobFormService: JobEditFormService,
  ) { }

  get customerContr() { return this.jobForm.controls.customer; }

  newJobId$: Observable<number> | undefined;

  /** Ctrl-Enter clicks the accept button */
  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey) {
      this.acceptButton.nativeElement.click();
    }
  }

  ngOnInit(): void {
    this.jobForm = this.jobFormService.jobFormBuilder(this.data.job);

    if (!this.jobForm.get('jobId').value && typeof this.data.jobCreateFn === 'function') {
      this.customerContr.valueChanges.pipe(
        filter(() => this.customerContr.valid),
        map(cust => ({
          customer: cust,
          name: this.jobForm.value.name || 'Jauns darbs',
          jobStatus: {
            generalStatus: this.jobForm.value.jobStatus.generalStatus
          }
        })),
        take(1),
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
