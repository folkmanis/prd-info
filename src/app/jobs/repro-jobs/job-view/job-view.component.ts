import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_CARD_CONFIG, MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { firstValueFrom } from 'rxjs';
import { assertArray, ConfirmationDialogService, CopyJobIdAndNameDirective, notNullOrThrow } from 'src/app/library';
import { KeyPressDirective } from 'src/app/library/directives';
import { navigateRelative, RouterLinkToReturnDirective, RouterLinkWithReturnDirective } from 'src/app/library/navigation';
import { ViewSizeDirective, ViewSmallDirective } from 'src/app/library/view-size';
import { LoginService } from 'src/app/login';
import { configuration } from 'src/app/services/config.provider';
import { Job } from '../../interfaces';
import { parseJobId } from '../services/parse-job-id';
import { ReproJobService } from '../services/repro-job.service';
import { JobCopyDirective } from './job-copy.directive';
import { JobPathPipe } from './job-path.pipe';
import { JobProductsComponent } from './job-products/job-products.component';

const FOLDER_CREATE_CONFIRMATION = 'Iespējams, darba mape jau pastāv. Vai tiešām vēlreiz izveidot mapi?';

@Component({
  selector: 'app-job-view',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIcon,
    KeyPressDirective,
    MatDivider,
    MatCardModule,
    JobCopyDirective,
    RouterLinkWithReturnDirective,
    RouterLinkToReturnDirective,
    JobPathPipe,
    JobProductsComponent,
    ViewSmallDirective,
    CopyJobIdAndNameDirective,
    MatTooltipModule,
  ],
  templateUrl: './job-view.component.html',
  styleUrl: './job-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ViewSizeDirective],
  providers: [
    {
      provide: MAT_CARD_CONFIG,
      useValue: { appearance: 'outlined' },
    },
  ],
})
export class JobViewComponent {
  private categories = configuration('jobs', 'productCategories');
  private productionStages = configuration('jobs', 'jobStates');
  private confirm = inject(ConfirmationDialogService);
  private jobService = inject(ReproJobService);
  private snack = inject(MatSnackBar);
  private navigate = navigateRelative();

  initialValue = input.required<Omit<Job, 'jobId'>>({ alias: 'job' });
  job = linkedSignal(this.initialValue);
  jobId = input.required({ transform: parseJobId });
  jobWithId = computed(() => ({ ...this.job(), jobId: this.jobId() }));

  showPrices = inject(LoginService).isModule('calculations');

  editDisabled = computed(() => !!this.job().invoiceId);

  productionCategory = computed(() => this.getJobCategoryName(this.job().production.category));
  generalStatus = computed(() => this.getProductionStageName(this.job().jobStatus.generalStatus));

  async onCreateFolder() {
    if (Array.isArray(this.job().files?.path) && (await this.confirmFolderCreation()) === false) {
      return;
    }
    const jobId = notNullOrThrow(this.jobId());
    const update = await this.jobService.createFolder(jobId);
    this.job.set(update);
    assertArray(update?.files?.path);
    this.snack.open(`Izveidota mape ${update.files.path.join('/')}`, 'OK');
  }

  async onUpdateFolderLocation() {
    try {
      const jobId = notNullOrThrow(this.jobId());
      const update = await this.jobService.updateFilesLocation(jobId);
      this.job.set(update);

      assertArray(update?.files?.path);
      this.snack.open(`Mape pārvietota uz ${update.files.path.join('/')}`, 'OK');
    } catch (error) {
      this.snack.open(`Mape nevar tikt pārvietota: ${error.error?.message ?? error.message}`, 'OK');
    }
  }

  async onSetGatavs() {
    const jobId = notNullOrThrow(this.jobId());
    await this.jobService.updateJob({
      jobId,
      jobStatus: {
        generalStatus: 30,
        timestamp: new Date(),
      },
    });
    this.navigate(['..']);
  }

  private getJobCategoryName(category: string): string {
    return this.categories().find((c) => c.category === category)?.description || category;
  }

  private getProductionStageName(stage: number): string | null {
    return this.productionStages().find((s) => s.state === stage)?.description || null;
  }

  private async confirmFolderCreation() {
    return firstValueFrom(this.confirm.confirm(FOLDER_CREATE_CONFIRMATION));
  }
}
