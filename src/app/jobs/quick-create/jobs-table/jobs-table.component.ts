import { ChangeDetectionStrategy, Component, input, TrackByFunction } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { JobUnwindedPartial } from '../../interfaces';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-jobs-table',
  imports: [MatTableModule, DatePipe],
  templateUrl: './jobs-table.component.html',
  styleUrl: './jobs-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsTableComponent {
  jobs = input.required<JobUnwindedPartial[]>();

  protected displayedColumns = ['receivedDate', 'custCode', 'jobId', 'name', 'productsName', 'productsCount'];

  protected jobsTrack: TrackByFunction<JobUnwindedPartial> = (_, j) => j.jobId;
}
