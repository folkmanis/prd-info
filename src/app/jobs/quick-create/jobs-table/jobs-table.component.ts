import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, TrackByFunction } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterLinkWithReturnDirective } from 'src/app/library/navigation';
import { JobUnwindedPartial } from '../../interfaces';

@Component({
  selector: 'app-jobs-table',
  imports: [MatTableModule, DatePipe, RouterLinkWithReturnDirective, MatButton],
  templateUrl: './jobs-table.component.html',
  styleUrl: './jobs-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsTableComponent {
  jobs = input.required<JobUnwindedPartial[]>();

  protected displayedColumns = ['receivedDate', 'custCode', 'jobId', 'name', 'productsName', 'productsCount'];

  protected jobsTrack: TrackByFunction<JobUnwindedPartial> = (_, j) => j.jobId;
}
