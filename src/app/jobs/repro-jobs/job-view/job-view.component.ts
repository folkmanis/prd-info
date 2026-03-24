import { Clipboard } from '@angular/cdk/clipboard';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_CARD_CONFIG, MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { assertArray, CopyJobIdAndNameDirective, notNullOrThrow } from 'src/app/library';
import { ConfirmationDirective } from 'src/app/library/confirmation-dialog';
import { KeyPressDirective } from 'src/app/library/directives';
import {
  navigateRelative,
  RouterLinkToReturnDirective,
  RouterLinkWithReturnDirective,
} from 'src/app/library/navigation';
import { updateCatching } from 'src/app/library/update-catching';
import { ViewSizeDirective, ViewSmallDirective } from 'src/app/library/view-size';
import { LoginService } from 'src/app/login';
import { configuration } from 'src/app/services/config.provider';
import { Job } from '../../interfaces';
import { parseJobIdRequired } from '../services/parse-job-id';
import { ReproJobService } from '../services/repro-job.service';
import { JobCopyDirective } from './job-copy.directive';
import { JobPathPipe } from './job-path.pipe';
import { JobProductsComponent } from './job-products/job-products.component';

@Component({
  selector: 'app-job-view',
  imports: [
    DatePipe,
    MatButton,
    MatIconButton,
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
    ConfirmationDirective,
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
  #jobsConfig = configuration('jobs');
  #clipboard = inject(Clipboard);
  #jobService = inject(ReproJobService);
  #navigate = navigateRelative();
  #update = updateCatching();

  initialValue = input.required<Omit<Job, 'jobId'>>({ alias: 'job' });
  jobId = input.required({ transform: parseJobIdRequired });
  protected job = linkedSignal(this.initialValue);
  protected jobWithId = computed(() => ({ ...this.job(), jobId: this.jobId() }));

  protected showPrices = inject(LoginService).isModule('calculations');

  protected editDisabled = computed(() => !!this.job().invoiceId);

  protected productionCategory = computed(() => this.#getJobCategoryName(this.job().production.category));
  protected generalStatus = computed(() => this.#getProductionStageName(this.job().jobStatus.generalStatus));

  async onCreateFolder() {
    this.#update(async (message) => {
      const jobId = notNullOrThrow(this.jobId());
      const update = await this.#jobService.createFolder(jobId);
      this.job.set(update);
      assertArray(update?.files?.path);
      message(`Izveidota mape ${update.files.path.join('/')}`);
    });
  }

  async onUpdateFolderLocation() {
    this.#update(
      async (message) => {
        const jobId = notNullOrThrow(this.jobId());
        const update = await this.#jobService.updateFilesLocation(jobId);
        this.job.set(update);
        assertArray(update?.files?.path);
        message(`Mape pārvietota uz ${update.files.path.join('/')}`);
      },
      async (message, error) => {
        message(`Mape nevar tikt pārvietota: ${error.message}`);
      },
    );
  }

  async onSetGatavs() {
    this.#update(async (message) => {
      const jobId = notNullOrThrow(this.jobId());
      await this.#jobService.updateJob({
        jobId,
        jobStatus: {
          generalStatus: 30,
          timestamp: new Date(),
        },
      });
      message(`Darbs ${jobId} saglabāts`);
      this.#navigate(['..']);
    });
  }

  async onCopyPath() {
    this.#update(async (message) => {
      const path = this.job().files?.path;
      assertArray(path);
      const fullPath = `${this.#jobsConfig().jobRootPath}\\${path.join('\\')}`;
      this.#clipboard.copy(fullPath);
      message(`${fullPath} nokopēts`);
    });
  }

  #getJobCategoryName(category: string): string {
    return this.#jobsConfig().productCategories.find((c) => c.category === category)?.description || category;
  }

  #getProductionStageName(stage: number): string | null {
    return this.#jobsConfig().jobStates.find((s) => s.state === stage)?.description || null;
  }
}
