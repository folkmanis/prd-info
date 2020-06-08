import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, map, debounceTime, startWith } from 'rxjs/operators';
import { JobService } from '../services/job.service';
import { JobQueryFilter, JobProduct } from 'src/app/interfaces';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
  ) { }
  private readonly _subs = new Subscription();

  dataSource$ = this.jobService.jobs$.pipe(
    map(jobs => jobs.map(job => ({ ...job, productsObj: job.products as JobProduct })))
  );

  ngOnInit(): void {
    const subs = this.route.paramMap.pipe(
      map(params => params.keys.reduce((acc, key) => ({ ...acc, [key]: params.get(key) }), {} as JobQueryFilter)),
      map(filter => ({ ...filter, unwindProducts: 1 } as JobQueryFilter)),
    ).subscribe(this.jobService.filter$);
    this._subs.add(subs);
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

}
