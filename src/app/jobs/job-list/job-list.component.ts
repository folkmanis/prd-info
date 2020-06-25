import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { tap, map, debounceTime, startWith, filter, switchMap } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { JobQueryFilter, JobProduct, Job, JobPartial, JobOneProduct } from 'src/app/interfaces';
import { JobEditDialogService } from '../services/job-edit-dialog.service';
import { JobsState } from '../store/jobs.state';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobEditDialog: JobEditDialogService,
  ) { }
  private readonly _subs = new Subscription();

  @Select(JobsState.jobs) jobs$: Observable<JobOneProduct[]>;

  ngOnInit(): void {
    const subs = this.route.data.pipe(
      filter(data => data.newJob),
      switchMap(() => this.jobEditDialog.newJob()),
      tap(() => this.router.navigate(['jobs'])),
    ).subscribe();
    this._subs.add(subs);
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  onJobEdit(jobId: number) {
    this.jobEditDialog.editJob(jobId).subscribe();
  }

}
