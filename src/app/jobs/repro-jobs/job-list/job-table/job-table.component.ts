import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JobPartial } from 'src/app/jobs/interfaces';
import { CopyJobIdAndNameDirective } from 'src/app/library';
import { RouterLinkWithReturnDirective } from 'src/app/library/navigation';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { PartialJob } from '../../services/repro-job.service';

@Component({
  selector: 'app-job-table',
  imports: [MatMenuModule, MatIconModule, DatePipe, CopyJobIdAndNameDirective, RouterLinkWithReturnDirective, MatButtonModule, MatTooltipModule],
  templateUrl: './job-table.component.html',
  styleUrl: './job-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ViewSizeDirective],
})
export class JobTableComponent {
  protected isLarge = inject(ViewSizeDirective).isLarge;

  jobs = input.required<JobPartial[]>();

  highlitedJobId = input<string | null | undefined>(null);

  jobChange = output<PartialJob>();

  protected hasProduct(job: JobPartial, productName: string | null | undefined): boolean {
    return job.products?.some((product) => product.name === productName);
  }

  protected async onSetJobStatus(jobId: number, status: number) {
    const update = {
      jobId,
      jobStatus: {
        generalStatus: status,
        timestamp: new Date(),
      },
    };
    this.jobChange.emit(update);
  }
}
