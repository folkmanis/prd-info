import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Observer, of } from 'rxjs';
import { FileUploadMessage, Job } from '../../interfaces';
import { JobFormGroup } from '../services/job-form-group';
import { ReproJobService } from '../services/repro-job.service';
import { UploadRef } from '../services/upload-ref';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';
import { JobFormComponent } from './job-form/job-form.component';


@Component({
  selector: 'app-repro-job-edit',
  templateUrl: './repro-job-edit.component.html',
  styleUrls: ['./repro-job-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    JobFormGroup,
  ]
})
export class ReproJobEditComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(JobFormComponent) jobFormComponent: JobFormComponent;

  job: Partial<Job>;

  fileUploadProgress$: Observable<FileUploadMessage[]> = of([]);

  uploadRef: UploadRef | null = null;

  saved = false;

  private jobSaveObserver: Observer<Job> = {
    next: (job) => {
      this.saved = true;
      this.uploadRef?.addToJob(job.jobId);
      this.snack.openFromComponent(SnackbarMessageComponent, { data: { job, progress: this.fileUploadProgress$ } });
      this.router.navigate(['..'], { relativeTo: this.route });
    },
    error: (error) => this.snack.openFromComponent(SnackbarMessageComponent, { data: { progress: this.fileUploadProgress$, error } }),
    complete: () => { }
  };

  constructor(
    public form: JobFormGroup,
    private route: ActivatedRoute,
    private router: Router,
    private reproJobService: ReproJobService,
    private snack: MatSnackBar,
  ) { }

  ngOnInit(): void {

    this.job = this.route.snapshot.data.job;
    this.form.patchValue(this.job);

    if (this.reproJobService.uploadRef) {
      this.uploadRef = this.reproJobService.uploadRef;
      this.fileUploadProgress$ = this.uploadRef.onMessages();
      this.uploadRef.onAddedToJob().subscribe({
        error: (error) => this.snack.openFromComponent(SnackbarMessageComponent, { data: { progress: this.fileUploadProgress$, error } }),
      });
    }

  }

  ngAfterViewInit(): void {
    if (!this.job.customer) {
      this.jobFormComponent.customerInput.focus();
    }
  }

  ngOnDestroy(): void {
    this.reproJobService.uploadRef = null;
  }

  onUpdate() {
    const jobId = this.job.jobId;
    const jobUpdate: Partial<Job> = this.form.update;
    this.reproJobService.updateJob({ jobId, ...jobUpdate }, { updatePath: this.jobFormComponent.updateFolderLocation })
      .subscribe(this.jobSaveObserver);
  }

  onCreate() {
    const jobUpdate: Partial<Omit<Job, 'jobId'>> = this.form.update;
    this.reproJobService.uploadRef = null;
    this.reproJobService.createJob(jobUpdate)
      .subscribe(this.jobSaveObserver);
  }


}
