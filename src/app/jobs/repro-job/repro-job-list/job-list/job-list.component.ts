import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { JobBase, JobProduct } from 'src/app/interfaces';
import { LayoutService } from 'src/app/layout/layout.service';
import { DestroyService } from 'prd-cdk';
import { ClipboardService } from 'src/app/library/services/clipboard.service';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class JobListComponent implements OnInit {

  @Input('editorActive') set active(active: boolean) {
    this._active = active;
  }
  get active(): boolean {
    return this._active;
  }
  private _active = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private clipboard: ClipboardService,
    private layout: LayoutService,
    private destroy$: DestroyService,
  ) { }


  isLarge$ = this.layout.isLarge$;

  dataSource$ = this.jobService.jobs$.pipe(
    map(jobs => jobs.map(job => ({ ...job, productsObj: job.products as JobProduct }))),
  );

  ngOnInit(): void {
  }

  copyJobIdAndName(job: Pick<JobBase, 'jobId' | 'name'>, event: MouseEvent) {
    this.clipboard.copy(`${job.jobId}-${job.name}`);
    event.stopPropagation();
  }

  onSetJobStatus(jobId: number, status: number, event: MouseEvent) {
    this.jobService.updateJob({
      jobId,
      jobStatus: {
        generalStatus: status,
      }
    }).subscribe();
    event.stopPropagation();
  }

}
