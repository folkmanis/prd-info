import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { Customer, Job, JobProduct } from 'src/app/interfaces';
import { JobImportService } from '../../services/job-import.service';

@Component({
  selector: 'app-import-new-jobs',
  templateUrl: './import-new-jobs.component.html',
  styleUrls: ['./import-new-jobs.component.scss']
})
export class ImportNewJobsComponent implements OnInit {
  @Input('jobs')
  get jobs() { return this._jobs; }
  set jobs(value: Partial<Job>[]) {
    this._jobs = value;
    this.jobs$.next(this.jobs);
  }

  jobs$ = new Subject<Partial<Job>[]>();
  dataSource$ = this.jobs$.pipe(
    map(jobs => this.service.flattenJobs(jobs)),
    map(jobs => jobs.map(job => this.formatJob(job))),
  );
  dataColumns = [
    'jobId',
    'customer',
    'name',
    'receivedDate',
    'productName', //    name
    'price',
    'count',
    'comment',
  ];
  displayedColumns = ['idx', ...this.dataColumns];

  _jobs: Partial<Job>[];

  constructor(
    private service: JobImportService,
  ) { }

  ngOnInit(): void {
  }

  formatJob(job: Partial<Job>) {
    const { name: productName, price, count } = job.products as JobProduct || {};
    return {
      ...job, receivedDate: moment(job.receivedDate).format('L'), productName, price, count
    };
  }

}
