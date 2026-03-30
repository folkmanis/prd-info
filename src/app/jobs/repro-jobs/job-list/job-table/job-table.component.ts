import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JobPartial } from 'src/app/jobs/interfaces';
import { CopyJobIdAndNameDirective } from 'src/app/library';
import { RouterLinkWithReturnDirective } from 'src/app/library/navigation';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { PartialJob } from '../../services/repro-job.service';
import { JobsData } from '../../services/repro-job-list.service';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';

@Component({
  selector: 'app-job-table',
  imports: [
    MatMenuModule,
    MatIconModule,
    DatePipe,
    CopyJobIdAndNameDirective,
    RouterLinkWithReturnDirective,
    MatButtonModule,
    MatTooltipModule,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    ScrollTopDirective,
  ],
  templateUrl: './job-table.component.html',
  styleUrl: './job-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ViewSizeDirective],
})
export class JobTableComponent {
  protected isLarge = inject(ViewSizeDirective).isLarge;
  protected scroll = viewChild.required(ScrollTopDirective);

  scrollTopVisible = computed(() => this.scroll().visible());

  jobs = input.required<JobsData>();

  highlitedJobId = input<string | null | undefined>(null);

  jobChange = output<PartialJob>();

  protected hasProduct(job?: JobPartial, productName?: string | null | undefined): boolean {
    return !!job?.products?.some((product) => product.name === productName);
  }

  protected async onSetJobStatus(idx: number, jobId: number, status: number) {
    const update = {
      jobId,
      jobStatus: {
        generalStatus: status,
        timestamp: new Date(),
      },
    };
    this.jobs().updateAt(idx, update);
    this.jobChange.emit(update);
  }
}
