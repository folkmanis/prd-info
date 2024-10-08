import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AsyncPipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { Observable, Subscription, concatMap, of } from 'rxjs';
import { DropFolder } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library';
import { navigateRelative } from 'src/app/library/common';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { LoginService } from 'src/app/login';
import { FileUploadMessage, Job } from '../../interfaces';
import { JobFormService } from '../services/job-form.service';
import { ReproJobService } from '../services/repro-job.service';
import { UploadRef } from '../services/upload-ref';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';
import { UploadProgressComponent } from '../upload-progress/upload-progress.component';
import { DropFolderComponent } from './drop-folder/drop-folder.component';
import { FolderPathComponent } from './folder-path/folder-path.component';
import { JobFormComponent } from './job-form/job-form.component';
import { KeyPressDirective } from './key-press.directive';
import { ReproProductsEditorComponent } from './repro-products-editor/repro-products-editor.component';

@Component({
  selector: 'app-repro-job-edit',
  templateUrl: './repro-job-edit.component.html',
  styleUrls: ['./repro-job-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [JobFormService],
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
    ReproProductsEditorComponent,
  ],
  hostDirectives: [ViewSizeDirective],
})
export class ReproJobEditComponent {
  private snack = inject(MatSnackBar);
  private confirmationDialogService = inject(ConfirmationDialogService);
  private reproJobService = inject(ReproJobService);
  private location = inject(Location);

  private formService = inject(JobFormService);

  private customerInput = viewChild(JobFormComponent);

  private navigate = navigateRelative();

  private dropFolder = signal<DropFolder | null>(null);

  form = this.formService.form;

  update = this.formService.update;

  job = input.required<Job>();

  showPrices = inject(LoginService).isModule('calculations');

  fileUploadProgress$: Observable<FileUploadMessage[]> = of([]);

  uploadRef = input<UploadRef>();

  saved = signal(false);

  folderPath = computed(() => {
    const job = this.formService.value();
    return job.files?.path?.join('/') || '';
  });

  updateFolderLocationEnabled = computed(() => {
    const update = this.formService.update();
    return !!update && (!!update.customer || !!update.name || !!update.receivedDate);
  });

  saveDisabled = computed(() => this.formService.status() !== 'VALID' || (this.update() == undefined && this.dropFolder() == null) || this.saved());

  dropFolders$: Observable<DropFolder[]> = this.formService.dropFolders$;

  history = window.history;

  get isUpload(): boolean {
    return !!this.uploadRef();
  }

  updatePath = model(false);

  customerProducts$ = this.formService.customerProducts$;

  constructor() {
    effect(
      () => {
        this.formService.setValue(this.job());
        if (!this.job().customer) {
          this.customerInput().focusCustomer();
        }
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
  }

  async onUpdate() {
    this.saved.set(true);
    const jobId = this.formService.value().jobId;
    const jobUpdate = this.formService.update();
    try {
      const updatedJob = await this.reproJobService.updateJob({ jobId, ...jobUpdate }, { updatePath: this.updatePath() && this.updateFolderLocationEnabled() });
      this.onSaveSuccess(updatedJob);
    } catch (error) {
      this.onSaveError(error);
    }
  }

  async onCreate() {
    this.saved.set(true);
    const jobUpdate = this.formService.update();
    try {
      const createdJob = await this.reproJobService.createJob(jobUpdate);
      this.onSaveSuccess(createdJob);
    } catch (error) {
      this.onSaveError(error);
    }
  }

  async onCreateFolder() {
    const jobId = this.formService.value().jobId;
    try {
      const job = await this.reproJobService.createFolder(jobId);
      this.formService.form.controls.files.setValue(job.files);
    } catch (error) {
      this.confirmationDialogService.confirmDataError();
    }
  }

  onDropFolder(folder: DropFolder | null) {
    this.dropFolder.set(folder);
  }

  onBack() {
    this.location.back();
  }

  private copyToDropfolder({ files }: Pick<Job, 'files'>) {
    const dropFolder = this.dropFolder();

    if (!dropFolder) {
      return;
    }

    const uploadRef = this.uploadRef();
    if (uploadRef) {
      uploadRef
        .onAddedToJob()
        .pipe(concatMap((job) => job.files && this.reproJobService.copyToDropFolder(job.files.path, dropFolder.path)))
        .subscribe();
    } else {
      this.reproJobService.copyToDropFolder(files.path, dropFolder.path).subscribe();
    }
  }

  private onSaveSuccess(job: Job) {
    this.uploadRef()?.addToJob(job.jobId);
    this.copyToDropfolder(job);
    this.snack.openFromComponent(SnackbarMessageComponent, {
      data: { job, progress: this.fileUploadProgress$ },
    });
    this.navigate(['..']);
  }

  private onSaveError(error: unknown) {
    this.snack.openFromComponent(SnackbarMessageComponent, {
      data: { progress: this.fileUploadProgress$, error },
    });
  }
}
