import { ChangeDetectionStrategy, Component, Input, OnInit, Output } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { ReplaySubject, Subject } from 'rxjs';
import { ClipboardService } from 'src/app/library/services/clipboard.service';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { LayoutService } from 'src/app/services';
import { Job, JobPartial } from '../../interfaces';
import { JobService } from '../../services/job.service';


@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class JobListComponent implements OnInit {

  isLarge$ = this.layout.isLarge$;

  dataSource$ = this.jobService.jobs$;


  @Input('highlitedProduct') highlited: string | null = null;

  constructor(
    private jobService: JobService,
    private clipboard: ClipboardService,
    private layout: LayoutService,
    private sanitize: SanitizeService,
  ) { }


  ngOnInit(): void {
  }

  copyJobIdAndName({ name, jobId }: Pick<JobPartial, 'jobId' | 'name'>, event: MouseEvent) {
    this.clipboard.copy(`${jobId}-${this.sanitize.sanitizeFileName(name)}`);
    event.stopPropagation();
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
    ).subscribe();
  }

  hasProduct(job: JobPartial, productName: string): boolean {
    return job.products?.some(product => product.name === productName);
  }


}
