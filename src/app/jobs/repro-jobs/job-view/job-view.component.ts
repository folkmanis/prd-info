import { DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { KeyPressDirective } from 'src/app/library/directives';
import { Job } from '../../interfaces';
import { parseJobId } from '../services/parse-job-id';
import { MatDivider } from '@angular/material/divider';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { MAT_CARD_CONFIG, MatCardModule } from '@angular/material/card';
import { configuration } from 'src/app/services/config.provider';
import { JobProductComponent } from './job-product/job-product.component';
import { LoginService } from 'src/app/login';
import { ConfirmationDialogService } from 'src/app/library';
import { firstValueFrom } from 'rxjs';
import { JobCopyDirective } from './job-copy.directive';
import { RouterLinkToReturnDirective, RouterLinkWithReturnDirective } from 'src/app/library/navigation';
import { JobPathPipe } from './job-path.pipe';

@Component({
  selector: 'app-job-view',
  imports: [
    JobProductComponent,
    JsonPipe,
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

  job = input.required<Omit<Job, 'jobId'>>();
  jobId = input.required({ transform: parseJobId });
  jobWithId = computed(() => ({ ...this.job(), jobId: this.jobId() }));

  showPrices = inject(LoginService).isModule('calculations');

  editDisabled = computed(() => !!this.job().invoiceId);

  productionCategory = computed(() => this.getJobCategoryName(this.job().production.category));
  generalStatus = computed(() => this.getProductionStageName(this.job().jobStatus.generalStatus));

  private getJobCategoryName(category: string): string {
    return this.categories().find((c) => c.category === category)?.description || category;
  }

  private getProductionStageName(stage: number): string | null {
    return this.productionStages().find((s) => s.state === stage)?.description || null;
  }
}
