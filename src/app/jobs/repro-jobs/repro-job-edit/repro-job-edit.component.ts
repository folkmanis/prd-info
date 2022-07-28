import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable, Observer, of, startWith } from 'rxjs';
import { FileUploadMessage, Job } from '../../interfaces';
import { JobFormService } from '../services/job-form.service';
import { ReproJobService } from '../services/repro-job.service';
import { UploadRef } from '../services/upload-ref';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';
import { JobFormComponent } from './job-form/job-form.component';
import { log } from 'prd-cdk';


@Component({
  selector: 'app-repro-job-edit',
  templateUrl: './repro-job-edit.component.html',
  styleUrls: ['./repro-job-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    JobFormService,
  ]
})
export class ReproJobEditComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(JobFormComponent) jobFormComponent: JobFormComponent;

  form = this.formService.form;

  fileUploadProgress$: Observable<FileUploadMessage[]> = of([]);

  uploadRef: UploadRef | null = null;

  saved$ = new BehaviorSubject(false);

  saveDisabled$ = combineLatest({
    update: this.formService.update$,
    status: this.formService.form.statusChanges,
    saved: this.saved$,
  }).pipe(
    map(({ update, status, saved }) => status !== 'VALID' || update == undefined || saved),
    startWith(true),
  );


  private jobSaveObserver: Observer<Job> = {
    next: (job) => {
      this.uploadRef?.addToJob(job.jobId);
      this.snack.openFromComponent(SnackbarMessageComponent, { data: { job, progress: this.fileUploadProgress$ } });
      this.router.navigate(['..'], { relativeTo: this.route });
    },
    error: (error) => this.snack.openFromComponent(SnackbarMessageComponent, { data: { progress: this.fileUploadProgress$, error } }),
    complete: () => { }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reproJobService: ReproJobService,
    private snack: MatSnackBar,
    private formService: JobFormService,
  ) { }

  ngOnInit(): void {

    this.formService.setValue(this.route.snapshot.data.job);

    if (this.reproJobService.uploadRef) {
      this.uploadRef = this.reproJobService.uploadRef;
      this.fileUploadProgress$ = this.uploadRef.onMessages();
      this.uploadRef.onAddedToJob().subscribe({
        error: (error) => this.snack.openFromComponent(SnackbarMessageComponent, { data: { progress: this.fileUploadProgress$, error } }),
      });
    }

  }

  ngAfterViewInit(): void {
    if (!this.formService.value.customer) {
      this.jobFormComponent.customerInput.focus();
    }
  }

  ngOnDestroy(): void {
    this.reproJobService.uploadRef = null;
  }

  onUpdate() {
    this.saved$.next(true);
    const jobId = this.formService.value.jobId;
    const jobUpdate: Partial<Job> = this.formService.update;
    this.reproJobService.updateJob({ jobId, ...jobUpdate }, { updatePath: this.jobFormComponent.updateFolderLocation })
      .subscribe(this.jobSaveObserver);
  }

  onCreate() {
    this.saved$.next(true);
    const jobUpdate: Partial<Omit<Job, 'jobId'>> = this.formService.update;
    this.reproJobService.uploadRef = null;
    this.reproJobService.createJob(jobUpdate)
      .subscribe(this.jobSaveObserver);
  }


}
