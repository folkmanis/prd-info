import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef, HostListener, Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFormGroup, IFormControl } from '@rxweb/types';
import { Observable, EMPTY } from 'rxjs';
import { concatMap, filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { JobBase } from 'src/app/interfaces';
import { DestroyService } from 'src/app/library/rx/destroy.service';
import { JobEditDialogData } from './job-edit-dialog-data';
import { JobEditFormService } from './services/job-edit-form.service';
import { JobEditDialogResult } from './job-edit-dialog-result';

@Component({
  selector: 'app-job-dialog',
  templateUrl: './job-dialog.component.html',
  styleUrls: ['./job-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService, JobEditFormService]
})
export class JobDialogComponent implements OnInit {
  @ViewChild('accept', { read: ElementRef }) private acceptButton: ElementRef;

  jobForm: IFormGroup<JobBase>;
  files: File[] | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: JobEditDialogData,
    private dialogRef: MatDialogRef<JobDialogComponent, JobEditDialogResult>,
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
    this.files = this.data.files && [...this.data.files];

    this.newJob(this.jobForm, this.data.jobCreateFn)
      .subscribe(jobId => this.jobForm.patchValue({ jobId, jobStatus: { generalStatus: 20 } }));
  }

  /**
   * Jauna darba izveides funkcija
   * Atgriež jaunā darba jobId
   * Ja formā jau ir jobId (darbs nav jauns), tad atgriež EMPTY
   *
   * @param form forma ar darbu
   * @param jobCreateFn darba izveides funkcija
   */
  private newJob(
    form: IFormGroup<JobBase>,
    jobCreateFn: (job: Partial<JobBase>) => Observable<number>
  ): Observable<number> {
    if (form.value.jobId || typeof this.data.jobCreateFn !== 'function') {
      return EMPTY;
    }
    const customerContr = form.controls.customer;
    return customerContr.valueChanges.pipe(
      filter(() => customerContr.valid),
      map(cust => ({
        customer: cust,
        name: form.value.name || 'Jauns darbs',
        jobStatus: {
          generalStatus: form.value.jobStatus.generalStatus
        }
      })),
      take(1),
      concatMap(job => jobCreateFn(job)),
    );
  }

  onSave() {
    const result: JobEditDialogResult = {
      job: this.jobForm.value,
      files: this.files?.length ? this.files : undefined,
    };
    this.dialogRef.close(result);
  }

}
