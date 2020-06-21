import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, map, debounceTime, startWith, filter, switchMap } from 'rxjs/operators';
import { JobService } from '../services/job.service';
import { JobQueryFilter, JobProduct } from 'src/app/interfaces';
import { JobEditDialogService } from '../services/job-edit-dialog.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private jobEditDialog: JobEditDialogService,
  ) { }
  private readonly _subs = new Subscription();

  dataSource$ = this.jobService.jobs$.pipe(
    map(jobs => jobs.map(job => ({ ...job, productsObj: job.products as JobProduct })))
  );

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
