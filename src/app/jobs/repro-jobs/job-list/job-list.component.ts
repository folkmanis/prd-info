import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { EMPTY, Subject, from } from 'rxjs';
import { CopyClipboardDirective } from 'src/app/library/clipboard/copy-clipboard.directive';
import { navigateRelative } from 'src/app/library/navigation';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { ViewLargeDirective, ViewNotLargeDirective } from 'src/app/library/view-size';
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
        CdkVirtualScrollViewport,
        CdkFixedSizeVirtualScroll,
        ScrollTopDirective,
        CdkVirtualForOf,
        RouterLink,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatMenuModule,
        AsyncPipe,
        DatePipe,
        CopyClipboardDirective,
        ViewNotLargeDirective,
    ]
})
export class JobListComponent {
  private jobService = inject(JobService);
  private router = inject(Router);
  private uploadRefService = inject(UploadRefService);
  private reproJobService = inject(ReproJobService);
  private sanitize = inject(SanitizeService);

  private navigate = navigateRelative();

  isLarge = false;

  filter = input.required<JobQueryFilter>();

  reload$ = new Subject<void>();

  jobs$ = this.jobService.getJobsObserver(toObservable(this.filter), this.reload$);

  products = inject(ProductsService).activeProducts;

  highlited: string | null = null;

  copyJobIdAndName({ name, jobId }: Pick<JobPartial, 'jobId' | 'name'>) {
    return `${jobId}-${this.sanitize.sanitizeFileName(name)}`;
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
    this.reload$.next();
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
