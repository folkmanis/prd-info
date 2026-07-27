import { CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import { Component, input, TrackByFunction } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLinkWithReturnDirective } from 'src/app/library/navigation';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { JobFilter, JobUnwindedPartial } from '../../interfaces';
import { JobsData } from '../../services/job-list.service';
import { JobListFilterSummaryComponent } from '../job-list-filter-summary/job-list-filter-summary.component';

@Component({
  selector: 'app-job-list-table',
  imports: [
    DatePipe,
    RouterLinkWithReturnDirective,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    ScrollTopDirective,
    MatTableModule,
    ViewSizeDirective,
    MatIcon,
    JobListFilterSummaryComponent,
  ],
  templateUrl: './job-list-table.component.html',
  styleUrl: './job-list-table.component.scss',
})
export class JobListTableComponent {
  protected columnsLarge = [
    'state',
    'jobId',
    'customer',
    'date',
    'name',
    'products-name',
    'products-count',
    'products-units',
  ];
  protected columnsSmall = ['jobId', 'customer', 'name'];

  jobs = input.required<JobsData<JobUnwindedPartial>>();

  filter = input<JobFilter | null>();

  protected trackByFn: TrackByFunction<JobUnwindedPartial> = (idx, job) => job?.jobId ?? idx;
}
