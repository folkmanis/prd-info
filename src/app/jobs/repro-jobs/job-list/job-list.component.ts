import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, resource, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { isEqual } from 'lodash-es';
import { EMPTY, from } from 'rxjs';
import { CopyJobIdAndNameDirective } from 'src/app/library';
import { navigateRelative, RouterLinkWithReturnDirective } from 'src/app/library/navigation';
import { ViewLargeDirective, ViewNotLargeDirective } from 'src/app/library/view-size';
import { NotificationsService } from 'src/app/services';
import { ProductsService } from 'src/app/services/products.service';
import { ScrollTopDirective } from '../../../library/scroll-to-top/scroll-top.directive';
import { DrawerButtonDirective } from '../../../library/side-button/drawer-button.directive';
import { JobPartial, JobQueryFilter } from '../../interfaces';
import { JobService } from '../../services/job.service';
import { JobFilterComponent } from '../job-filter/job-filter.component';
import { ProductsSummaryComponent } from '../products-summary/products-summary.component';
import { ReproJobService } from '../services/repro-job.service';
import { UploadRefService } from '../services/upload-ref.service';
import { NewJobButtonComponent } from './new-job-button/new-job-button.component';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavModule,
    ViewLargeDirective,
    DrawerButtonDirective,
    ProductsSummaryComponent,
    NewJobButtonComponent,
    JobFilterComponent,
    ScrollTopDirective,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    DatePipe,
    ViewNotLargeDirective,
    MatProgressBar,
    CopyJobIdAndNameDirective,
    RouterLinkWithReturnDirective,
  ],
})
export class JobListComponent {
  private jobService = inject(JobService);
  private router = inject(Router);
  private uploadRefService = inject(UploadRefService);
  private reproJobService = inject(ReproJobService);

  private notifications$ = inject(NotificationsService).wsMultiplex('jobs');

  private navigate = navigateRelative();

  isLarge = false;

  filter = input.required<JobQueryFilter>();
  private filterChanges = computed(() => this.filter(), { equal: isEqual });

  jobsRef = this.jobService.getJobsResource(this.filterChanges);

  private products = inject(ProductsService).getProductsResource().asReadonly();
  activeProducts = computed(() => this.products.value().filter((product) => !product.inactive));

  highlited: string | null = null;

  constructor() {
    effect((onCleanup) => {
      const subs = this.notifications$.subscribe(() => {
        this.jobsRef.reload();
      });
      onCleanup(() => subs.unsubscribe());
    });
  }

  onJobFilter(filter: JobQueryFilter) {
    this.navigate(['.'], { queryParams: filter });
  }

  async onSetJobStatus(jobId: number, status: number) {
    await this.jobService.updateJob(jobId, {
      jobStatus: {
        generalStatus: status,
        timestamp: new Date(),
      },
    });
    this.jobsRef.reload();
  }

  hasProduct(job: JobPartial, productName: string): boolean {
    return job.products?.some((product) => product.name === productName);
  }

  onFileDrop(fileList: FileList) {
    const name = this.reproJobService.jobNameFromFiles(Array.from(fileList).map((file) => file.name));
    const sortedFiles = Array.from(fileList).sort((a, b) => a.size - b.size);

    this.uploadRefService.setUserFile(from(sortedFiles), EMPTY);

    this.reproJobService.setJobTemplate({ name });

    this.router.navigate(['jobs', 'repro', 'new']);
  }
}
