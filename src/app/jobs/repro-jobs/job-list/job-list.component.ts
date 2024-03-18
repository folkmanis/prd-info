import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, from, map } from 'rxjs';
import { CopyClipboardDirective } from "src/app/library/directives/copy-clipboard.directive";
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { ProductsService } from 'src/app/services/products.service';
import { ScrollTopDirective } from '../../../library/scroll-to-top/scroll-top.directive';
import { DrawerButtonDirective } from '../../../library/side-button/drawer-button.directive';
import { ViewSizeModule } from '../../../library/view-size/view-size.module';
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
  standalone: true,
  imports: [
    MatSidenavModule,
    ViewSizeModule,
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
  ],
})
export class JobListComponent {
  isLarge = false;

  filter$ = this.route.queryParams.pipe(
    map((query) => this.jobService.normalizeFilter(query))
  );

  reload$ = new Subject<void>();

  jobs$ = this.jobService.getJobsObserver(this.filter$, this.reload$);

  products$ = this.productsService.activeProducts$;

  highlited: string | null = null;

  constructor(
    private jobService: JobService,
    private router: Router,
    private userFileUpload: UploadRefService,
    private reproJobService: ReproJobService,
    private sanitize: SanitizeService,
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) { }

  copyJobIdAndName({ name, jobId }: Pick<JobPartial, 'jobId' | 'name'>) {
    return `${jobId}-${this.sanitize.sanitizeFileName(name)}`;
  }

  onJobFilter(filter: JobQueryFilter) {
    this.router.navigate(['.'], {
      queryParams: filter,
      relativeTo: this.route,
    });
  }

  onSetJobStatus(jobId: number, status: number) {
    this.jobService
      .updateJob(jobId, {
        jobStatus: {
          generalStatus: status,
          timestamp: new Date(),
        },
      })
      .subscribe(() => this.reload$.next());
  }

  hasProduct(job: JobPartial, productName: string): boolean {
    return job.products?.some((product) => product.name === productName);
  }

  onFileDrop(fileList: FileList) {
    if (this.reproJobService.uploadRef) {
      return;
    }

    const name = this.reproJobService.jobNameFromFiles(
      Array.from(fileList).map((file) => file.name)
    );
    const sortedFiles = Array.from(fileList).sort((a, b) => a.size - b.size);

    this.reproJobService.uploadRef = this.userFileUpload.userFileUploadRef(
      from(sortedFiles)
    );

    this.router
      .navigate(['jobs', 'repro', 'new', { name }])
      .then((navigated) => {
        if (!navigated) this.reproJobService.uploadRef = null;
      });
  }
}
