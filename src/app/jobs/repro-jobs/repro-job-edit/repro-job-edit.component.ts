import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, concatMap, map, Observable, Observer, of, startWith } from 'rxjs';
import { DropFolder } from 'src/app/interfaces';
import { FileUploadMessage, Job } from '../../interfaces';
import { JobFormService } from '../services/job-form.service';
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
    JobFormService,
  ]
})
export class ReproJobEditComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(JobFormComponent) private jobFormComponent: JobFormComponent;

  form = this.formService.form;

  fileUploadProgress$: Observable<FileUploadMessage[]> = of([]);

  uploadRef: UploadRef | null = null;

  saved$ = new BehaviorSubject(false);

  folderPath$ = this.formService.value$.pipe(
    map(job => job.files?.path),
    map(path => path?.join('/') || '')
  );

  updateFolderLocationEnabled$: Observable<boolean> = this.formService.update$.pipe(
    map(upd => !!upd && (!!upd.customer || !!upd.name || !!upd.receivedDate)),
  );

  private dropFolder$ = new BehaviorSubject<DropFolder | null>(null);

  saveDisabled$ = combineLatest({
    update: this.formService.update$,
    status: this.formService.form.statusChanges,
    saved: this.saved$,
    dropFolder: this.dropFolder$,
  }).pipe(
    map(({ update, status, saved, dropFolder }) => status !== 'VALID' || (update == undefined && dropFolder == null) || saved),
    startWith(true),
  );

  dropFolders$: Observable<DropFolder[]> = this.formService.dropFolders$;

  get isUpload(): boolean {
    return !!this.uploadRef;
  }


  private jobSaveObserver: Observer<Job> = {
    next: (job) => {
      this.uploadRef?.addToJob(job.jobId);
      this.copyToDropfolder(job);
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

  onCreateFolder() {
    const jobId = this.formService.value.jobId;
    this.reproJobService.createFolder(jobId).pipe(
      map(job => job.files),
    )
      .subscribe(files => this.formService.form.controls.files.setValue(files));
  }

  onDropFolder(folder: DropFolder | null) {
    this.dropFolder$.next(folder);
  }

  private copyToDropfolder({ files }: Pick<Job, 'files'>) {

    const dropFolder = this.dropFolder$.value;

    if (!dropFolder) {
      return;
    }

    if (this.uploadRef) {
      this.uploadRef.onAddedToJob().pipe(
        concatMap(job => job.files && this.reproJobService.copyToDropFolder(job.files.path, dropFolder.path))
      ).subscribe();
    } else {
      this.reproJobService.copyToDropFolder(files.path, dropFolder.path).subscribe();
    }
  }


}
