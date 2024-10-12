import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AsyncPipe, Location } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, effect, inject, Injector, input, model, signal, untracked, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { isEqual, pickBy } from 'lodash-es';
import { combineLatest, concat, concatMap, distinctUntilChanged, filter, map, merge, Observable, of, Subscription, switchMap, throttleTime } from 'rxjs';
import { DropFolder } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library';
import { navigateRelative } from 'src/app/library/common';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { Files, FileUploadMessage, Job } from '../../interfaces';
import { parseJobId } from '../services/parse-job-id';
import { ReproJobService } from '../services/repro-job.service';
import { UploadRef } from '../services/upload-ref';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';
import { UploadProgressComponent } from '../upload-progress/upload-progress.component';
import { DropFolderComponent } from './drop-folder/drop-folder.component';
import { FolderPathComponent } from './folder-path/folder-path.component';
import { JobFormComponent } from './job-form/job-form.component';
import { KeyPressDirective } from './key-press.directive';

@Component({
  selector: 'app-repro-job-edit',
  templateUrl: './repro-job-edit.component.html',
  styleUrls: ['./repro-job-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    KeyPressDirective,
    MatIcon,
    RouterLink,
    JobFormComponent,
    MatCardModule,
    FolderPathComponent,
    UploadProgressComponent,
    DropFolderComponent,
    AsyncPipe,
    MatFormFieldModule,
    CdkTextareaAutosize,
    MatDivider,
    MatInputModule,
  ],
  hostDirectives: [ViewSizeDirective],
  host: {
    '[class.app-disabled]': 'form.disabled',
  },
})
export class ReproJobEditComponent {
  private snack = inject(MatSnackBar);
  private confirmationDialogService = inject(ConfirmationDialogService);
  private jobService = inject(ReproJobService);
  private location = inject(Location);
  private injector = inject(Injector);

  private customerInput = viewChild(JobFormComponent);

  private navigate = navigateRelative();

  jobId = input<number | null, unknown>(null, { transform: parseJobId });
  initialValue = input.required<Omit<Job, 'jobId'>>({ alias: 'job' });

  form = new FormControl<Partial<Omit<Job, 'jobId'>>>({});

  value$: Observable<Partial<Omit<Job, 'jobId'>>> = merge(of(null), this.form.valueChanges).pipe(map(() => this.form.getRawValue() as Partial<Job>));
  value = toSignal(this.value$, { requireSync: true });
  status = toSignal(this.form.statusChanges, { initialValue: this.form.status });

  changes = computed(() => {
    const initial = this.initialValue();
    const diff = pickBy(this.value(), (value, key) => !isEqual(value, initial[key]));
    return Object.keys(diff).length ? diff : null;
  });

  dropFolder = model<DropFolder | null>(null);
  fileUploadProgress$: Observable<FileUploadMessage[]> = of([]);
  uploadRef = input<UploadRef>();
  folderPath = computed(() => {
    const job = this.value();
    return job.files?.path?.join('/') || '';
  });
  dropFolders = toSignal(this.getDropFolders(), { initialValue: [] });
  dropFolderActive = model(false);
  isUpload = computed(() => !!this.uploadRef());
  updatePath = model(false);

  updateFolderLocationEnabled = computed<boolean>(() => {
    const update = this.changes();
    return update && Boolean(update.customer || update.name || update.receivedDate);
  });

  saveDisabled = computed(() => {
    return this.status() !== 'VALID' || this.changes() === null;
  });

  history = window.history;

  constructor() {
    effect(
      () => {
        const initial = this.initialValue();
        this.form.reset(initial);
        this.updateDisabledState(initial);
        afterNextRender(
          () => {
            initial.customer || this.customerInput().focusCustomer();
          },
          { injector: this.injector },
        );
      },
      { allowSignalWrites: true },
    );

    effect((onCleanup) => {
      const uploadRef = this.uploadRef();
      let subs: Subscription;

      if (uploadRef) {
        this.fileUploadProgress$ = uploadRef.onMessages();
        subs = uploadRef.onAddedToJob().subscribe({
          error: (error) =>
            this.snack.openFromComponent(SnackbarMessageComponent, {
              data: { progress: this.fileUploadProgress$, error },
            }),
        });
      }

      onCleanup(() => subs?.unsubscribe());
    });

    effect(
      () => {
        const defaultFolder = this.dropFolders()[0] || null;
        const active = this.isUpload() && defaultFolder !== null;
        untracked(() => {
          this.dropFolder.set(defaultFolder);
          this.dropFolderActive.set(active);
        });
      },
      { allowSignalWrites: true },
    );
  }

  async onUpdate() {
    const jobId = this.jobId();
    const jobUpdate = this.changes();
    await this.updateJob();
    try {
      const updatedJob = await this.jobService.updateJob({ jobId, ...jobUpdate }, { updatePath: this.updatePath() && this.updateFolderLocationEnabled() });
      this.onSaveSuccess(updatedJob);
    } catch (error) {
      this.saveErrorMessage(error);
    }
  }

  async onCreate() {
    const jobUpdate = this.value();
    try {
      const createdJob = await this.jobService.createJob(jobUpdate);
      this.onSaveSuccess(createdJob);
    } catch (error) {
      this.saveErrorMessage(error);
    }
  }

  async onCreateFolder() {
    try {
      await this.updateJob();
      await this.jobService.createFolder(this.jobId());
      this.form.markAsPristine();
      this.navigate(['..']);
    } catch (error) {
      this.confirmationDialogService.confirmDataError();
    }
  }

  onBack() {
    this.location.back();
  }

  private async updateJob(): Promise<null | Job> {
    const jobId = this.jobId();
    const jobUpdate = this.changes();
    if (jobUpdate === null) {
      return null;
    }
    try {
      const jobUpdated = await this.jobService.updateJob({ jobId, ...jobUpdate }, { updatePath: this.updatePath() && this.updateFolderLocationEnabled() });
      this.form.reset(jobUpdated);
      return jobUpdated;
    } catch (error) {
      this.confirmationDialogService.confirmDataError(error.message);
    }
  }

  private copyToDropfolder(files: Files): Observable<boolean> {
    const dropFolder = this.dropFolder();
    const uploadRef = this.uploadRef();

    if (uploadRef) {
      return uploadRef.onAddedToJob().pipe(concatMap((job) => job.files && this.jobService.copyToDropFolder(job.files.path, dropFolder.path)));
    } else {
      return this.jobService.copyToDropFolder(files.path, dropFolder.path);
    }
  }

  private async uploadFiles({ jobId, files }: Pick<Job, 'jobId' | 'files'>) {
    this.uploadRef()?.addToJob(jobId);

    if (this.dropFolderActive() && this.dropFolder() !== null) {
      this.copyToDropfolder(files).subscribe();
    }
  }

  private onSaveSuccess(job: Job) {
    this.uploadRef()?.addToJob(job.jobId);

    if (this.dropFolderActive() && this.dropFolder() !== null) {
      this.copyToDropfolder(job).subscribe();
    }

    this.form.markAsPristine();
    this.snack.openFromComponent(SnackbarMessageComponent, {
      data: { job, progress: this.fileUploadProgress$ },
    });
    this.navigate(['..']);
  }

  private saveSuccessMessage({ jobId, name }: { jobId: number; name: string }) {
    this.snack.openFromComponent(SnackbarMessageComponent, {
      data: { jobId, name, progress: this.fileUploadProgress$ },
    });
  }

  private saveErrorMessage(error: unknown) {
    this.snack.openFromComponent(SnackbarMessageComponent, {
      data: { progress: this.fileUploadProgress$, error },
    });
  }

  private getDropFolders(): Observable<DropFolder[]> {
    const form = this.form;

    return combineLatest({
      status: form.statusChanges,
      value: concat(of(form.value), form.valueChanges),
    }).pipe(
      filter(({ status }) => status === 'VALID'),
      map(({ value }) => value),
      distinctUntilChanged((j1, j2) => j1.customer === j2.customer && isEqual(j1.products, j2.products)),
      throttleTime(200),
      switchMap((job) => this.jobService.getDropFolders(job.products, job.customer)),
    );
  }

  private updateDisabledState(value: Partial<Job>) {
    if (value.invoiceId) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }
}
