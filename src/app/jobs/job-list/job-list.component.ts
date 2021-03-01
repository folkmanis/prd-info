import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { JobProduct } from 'src/app/interfaces';
import { LayoutService } from 'src/app/layout/layout.service';
import { DestroyService } from 'prd-cdk';
import { ClipboardService } from 'src/app/library/services/clipboard.service';
import { JobService } from 'src/app/services/job.service';
import { JobEditDialogService } from '../job-edit';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class JobListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private jobEditDialog: JobEditDialogService,
    private clipboard: ClipboardService,
    private layout: LayoutService,
    private destroy$: DestroyService,
  ) { }


  isLarge$ = this.layout.isLarge$;

  dataSource$ = this.jobService.jobs$.pipe(
    map(jobs => jobs.map(job => ({ ...job, productsObj: job.products as JobProduct })))
  );

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id') as string | undefined),
      filter(id => id === 'new' || /^\d+$/.test(id)),
      switchMap(id => {
        if (id === 'new') {
          return this.jobEditDialog.newJob({ category: 'repro' });
        } else {
          return this.jobEditDialog.editJob(+id);
        }
      }),
      takeUntil(this.destroy$),
    ).subscribe(() => this.router.navigate(['/jobs']));
  }

  onJobEdit(jobId: number) {
    this.router.navigate([{ id: jobId }], { relativeTo: this.route });
  }

  copyJobIdAndName(jobId: number, name: string) {
    this.clipboard.copy(`${jobId}-${name}`);
  }

  onSetJobStatus(jobId: number, status: number) {
    this.jobService.updateJob({
      jobId,
      jobStatus: {
        generalStatus: status,
      }
    }).subscribe();
  }

}
