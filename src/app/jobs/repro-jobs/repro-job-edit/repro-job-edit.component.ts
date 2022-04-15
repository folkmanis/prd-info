import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { Observable, Observer, of } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { FileUploadMessage, Job } from '../../interfaces';
import { JobFormGroup } from '../services/job-form-group';
import { ReproJobService } from '../services/repro-job.service';
import { UploadRef } from '../services/upload-ref';


@Component({
  selector: 'app-repro-job-edit',
  templateUrl: './repro-job-edit.component.html',
  styleUrls: ['./repro-job-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    JobFormGroup,
  ]
})
export class ReproJobEditComponent implements OnInit, OnDestroy {

  job: Job;

  fileUploadProgress$: Observable<FileUploadMessage[]>;

  uploadRef: UploadRef | null = null;

  saved = false;

  private jobSaveObserver: Observer<Job> = {
    next: (job) => this.snack.open(`Darbs ${job.jobId}-${job.name} saglabāts!`, 'OK'),
    error: () => this.snack.open(`Neizdevās saglabāt darbu.`, 'OK'),
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

    this.uploadRef = this.reproJobService.uploadRef;
    this.fileUploadProgress$ = this.uploadRef?.onMessages() || of([]);
  }

  ngOnDestroy(): void {
    this.reproJobService.uploadRef = null;
  }

  onUpdate() {
    const jobId = this.job.jobId;
    const jobUpdate: Partial<Job> = this.form.update;
    this.reproJobService.updateJob({ jobId, ...jobUpdate }).pipe(
      tap(() => this.saved = true),
      tap(() => this.router.navigate(['..'], { relativeTo: this.route })),
    )
      .subscribe(this.jobSaveObserver);

  }

  onCreate() {
    const jobUpdate: Partial<Omit<Job, 'jobId'>> = this.form.update;
    this.reproJobService.createJob(jobUpdate).pipe(
      tap(() => this.saved = true),
      tap(() => this.router.navigate(['..'], { relativeTo: this.route })),
      concatMap(job => this.uploadRef ? this.uploadRef.addToJob(job.jobId).pipe(map(() => job)) : of(job)),
    ).subscribe(this.jobSaveObserver);
  }


}
