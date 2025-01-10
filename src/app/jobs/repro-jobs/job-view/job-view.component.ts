import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_CARD_CONFIG, MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { KeyPressDirective } from 'src/app/library/directives';
import { RouterLinkToReturnDirective, RouterLinkWithReturnDirective } from 'src/app/library/navigation';
import { ViewSizeDirective, ViewSmallDirective } from 'src/app/library/view-size';
import { LoginService } from 'src/app/login';
import { configuration } from 'src/app/services/config.provider';
import { Job } from '../../interfaces';
import { parseJobId } from '../services/parse-job-id';
import { JobCopyDirective } from './job-copy.directive';
import { JobPathPipe } from './job-path.pipe';
import { JobProductsComponent } from './job-products/job-products.component';

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
