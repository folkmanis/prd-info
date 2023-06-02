import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { from, map, Subject } from 'rxjs';
import { ClipboardService } from 'src/app/library/services/clipboard.service';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { JobPartial, JobQueryFilter } from '../../interfaces';
import { JobService } from '../../services/job.service';
import { ReproJobService } from '../services/repro-job.service';
import { UploadRefService } from '../services/upload-ref.service';
import { ProductsService } from 'src/app/services/products.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ScrollTopDirective } from '../../../library/scroll-to-top/scroll-top.directive';
import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from '@angular/cdk/scrolling';
import { JobFilterComponent } from '../job-filter/job-filter.component';
import { NewJobButtonComponent } from './new-job-button/new-job-button.component';
import { ProductsSummaryComponent } from '../products-summary/products-summary.component';
import { DrawerButtonDirective } from '../../../library/side-button/drawer-button.directive';
import { ViewSizeModule } from '../../../library/view-size/view-size.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';


@Component({
    selector: 'app-job-list',
    templateUrl: './job-list.component.html',
    styleUrls: ['./job-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
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
        NgFor,
        AsyncPipe,
        DatePipe,
    ],
})
export class JobListComponent {

  isLarge = false;

  filter$ = this.route.queryParams.pipe(
    map(query => this.jobService.normalizeFilter(query)),
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
    private clipboard: ClipboardService,
    private sanitize: SanitizeService,
    private route: ActivatedRoute,
    private productsService: ProductsService,
  ) { }


  copyJobIdAndName({ name, jobId }: Pick<JobPartial, 'jobId' | 'name'>) {
    this.clipboard.copy(`${jobId}-${this.sanitize.sanitizeFileName(name)}`);
  }

  onJobFilter(filter: JobQueryFilter) {
    this.router.navigate(['.'], { queryParams: filter, relativeTo: this.route });
  }

  onSetJobStatus(jobId: number, status: number) {

    this.jobService.updateJob(
      jobId,
      {
        jobStatus: {
          generalStatus: status,
          timestamp: new Date(),
        }
      }
    ).subscribe(() => this.reload$.next());
  }

  hasProduct(job: JobPartial, productName: string): boolean {
    return job.products?.some(product => product.name === productName);
  }

  onFileDrop(fileList: FileList) {

    if (this.reproJobService.uploadRef) {
      return;
    }

    const name = this.reproJobService.jobNameFromFiles(
      Array.from(fileList).map(file => file.name)
    );
    const sortedFiles = Array.from(fileList).sort((a, b) => a.size - b.size);

    this.reproJobService.uploadRef = this.userFileUpload.userFileUploadRef(from(sortedFiles));

    this.router.navigate(['jobs', 'repro', 'new', { name }])
      .then(navigated => {
        if (!navigated) this.reproJobService.uploadRef = null;
      });

  }



}
