import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, map, debounceTime, startWith, filter, switchMap } from 'rxjs/operators';
import { JobService } from '../services/job.service';
import { JobQueryFilter, JobProduct } from 'src/app/interfaces';
import { JobEditDialogService } from '../services/job-edit-dialog.service';
import { ClipboardService } from 'src/app/library/services/clipboard.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobListComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private jobEditDialog: JobEditDialogService,
    private clipboard: ClipboardService,
  ) { }

  private readonly _subs = new Subscription();

  dataSource$ = this.jobService.jobs$.pipe(
    map(jobs => jobs.map(job => ({ ...job, productsObj: job.products as JobProduct })))
  );

  ngOnInit(): void {
    this._subs.add(
      this.route.paramMap.pipe(
        map(params => params.get('id') as string | undefined),
        filter(id => id === 'new' || /^\d+$/.test(id)),
        switchMap(id => {
          if (id === 'new') {
            return this.jobEditDialog.newJob();
          } else {
            return this.jobEditDialog.editJob(+id);
          }
        }),
        tap(_ => this.router.navigate(['/jobs'])),
      ).subscribe()
    );
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
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
