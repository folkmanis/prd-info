import { AsyncPipe } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, effect, inject, Injector, input, linkedSignal, viewChild } from '@angular/core';
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
import { KeyPressDirective } from 'src/app/library/directives';
import { navigateToReturn, RouterLinkToReturnDirective } from 'src/app/library/navigation';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { Files, FileUploadMessage, Job } from '../../interfaces';
import { parseJobId } from '../services/parse-job-id';
import { ReproJobService } from '../services/repro-job.service';
import { UploadRefService } from '../services/upload-ref.service';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';
import { UploadProgressComponent } from '../upload-progress/upload-progress.component';
import { DropFolderComponent } from './drop-folder/drop-folder.component';
import { FolderPathComponent } from './folder-path/folder-path.component';
import { JobFormComponent } from './job-form/job-form.component';

@Component({
  selector: 'app-repro-job-edit',
  templateUrl: './repro-job-edit.component.html',
  styleUrls: ['./repro-job-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    MatDivider,
    MatInputModule,
    RouterLinkToReturnDirective,
  ],
  hostDirectives: [ViewSizeDirective],
  host: {
    '[class.app-disabled]': 'form.disabled',
  },
})
export class ReproJobEditComponent {
  private snack = inject(MatSnackBar);
  private jobService = inject(ReproJobService);
  private injector = inject(Injector);

  private customerInput = viewChild(JobFormComponent);

  private navigate = navigateToReturn();

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

  uploadRef = inject(UploadRefService).retrieveUploadRef();

  selectedDropFolder = linkedSignal(() => this.dropFolders()[0] || null);
  dropFolderActive = linkedSignal(() => this.uploadRef && this.selectedDropFolder() !== null);

  fileUploadProgress$: Observable<FileUploadMessage[]> = of([]);
  folderPath = computed(() => this.value().files?.path?.join('/') || '');

  private dropFolders$: Observable<DropFolder[]> = combineLatest({
    status: this.form.statusChanges,
    value: concat(of(this.form.value), this.form.valueChanges),
  }).pipe(
    filter(({ status }) => status === 'VALID'),
    map(({ value }) => value),
    distinctUntilChanged(isProductChanged),
    throttleTime(200),
    switchMap((job) => this.jobService.getDropFolders(job.products, job.customer)),
  );

  dropFolders = toSignal(this.dropFolders$, { initialValue: [] });

  saveDisabled = computed(() => {
    return (this.status() !== 'VALID' || (this.changes() === null && !!this.jobId())) && !this.dropFolderActive();
  });

  constructor() {
    effect(() => {
      const initial = this.initialValue();
      this.form.reset(initial);
      this.updateDisabledState(initial);
      afterNextRender(
        () => {
          initial.customer || this.customerInput().focusCustomer();
        },
        { injector: this.injector },
      );
    });

    effect((onCleanup) => {
      let subs: Subscription;

      if (this.uploadRef) {
        this.fileUploadProgress$ = this.uploadRef.onMessages();
        subs = this.uploadRef.onAddedToJob().subscribe({
          error: (error) =>
            this.snack.openFromComponent(SnackbarMessageComponent, {
              data: { progress: this.fileUploadProgress$, error },
            }),
        });
      }

      onCleanup(() => subs?.unsubscribe());
    });
  }

  async onUpdate() {
    const jobId = this.jobId();
    const jobUpdate = this.changes();
    let updatedJob = { ...this.initialValue() };
    if (jobUpdate) {
      try {
        updatedJob = await this.jobService.updateJob({ jobId, ...jobUpdate });
        this.form.markAsPristine();
      } catch (error) {
        this.saveErrorMessage(error);
        return;
      }
    }
    try {
      if (this.dropFolderActive() && this.selectedDropFolder() !== null) {
        this.copyToDropfolder(updatedJob.files).subscribe();
      }
    } catch (error) {}
    this.saveSuccessMessage({ jobId, name: updatedJob.name });
    this.navigate();
  }

  async onCreate() {
    const jobUpdate = this.value();
    try {
      const createdJob = await this.jobService.createJob(jobUpdate);
      this.form.markAsPristine();
      this.uploadFiles(createdJob);
      this.saveSuccessMessage(createdJob);
      this.navigate();
    } catch (error) {
      this.saveErrorMessage(error);
    }
  }

  private async uploadFiles({ jobId, files }: Pick<Job, 'jobId' | 'files'>) {
    this.uploadRef?.addToJob(jobId);

    if (this.dropFolderActive() && this.selectedDropFolder() !== null) {
      this.copyToDropfolder(files).subscribe();
    }
  }

  private copyToDropfolder(files: Files): Observable<boolean> {
    const dropFolder = this.selectedDropFolder();

    if (this.uploadRef) {
      return this.uploadRef.onAddedToJob().pipe(concatMap((job) => job.files && this.jobService.copyToDropFolder(job.files.path, dropFolder.path)));
    } else {
      return this.jobService.copyToDropFolder(files.path, dropFolder.path);
    }
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

  private updateDisabledState(value: Partial<Job>) {
    if (value.invoiceId) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }
}

function isProductChanged<T extends Pick<Job, 'customer' | 'products'>>(previous: T, current: T): boolean {
  return (
    previous.customer === current.customer &&
    isEqual(
      previous.products.map((p) => p.name),
      current.products.map((p) => p.name),
    )
  );
}
