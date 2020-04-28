import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, AbstractControl, AsyncValidatorFn, ValidationErrors, Validators } from '@angular/forms';
import { Observable, combineLatest, of } from 'rxjs';
import { tap, map, startWith, filter, switchMap } from 'rxjs/operators';
import { ProductsService, CustomersService, JobService } from '../services';
import { Customer, CustomerPartial } from '../services/customer';
import { Job } from '../services/job';

@Component({
  selector: 'app-plate-job',
  templateUrl: './plate-job.component.html',
  styleUrls: ['./plate-job.component.css']
})
export class PlateJobComponent implements OnInit {

  private activeJob: Job | undefined;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
  ) { }

  loadedJob$: Observable<Job | undefined> = this.route.paramMap.pipe(
    map(param => param.get('jobId') as string | undefined),
    switchMap(jobId => jobId ? this.jobService.getJob(+jobId) : of(undefined)),
    tap(job => this.activeJob = job),
    // tap(job => console.log(job)),
  );

  ngOnInit(): void {
  }

  onjobUpdate(event: Partial<Job>) {
    if (this.activeJob) {
      this.jobService.updateJob({ ...this.activeJob, ...event }).pipe(
        tap(() => this.navigateJob(this.activeJob.jobId)),
      ).subscribe();
    } else {
      this.jobService.newJob(event).pipe(
        tap(job => this.navigateJob(job.jobId)),
      ).subscribe();
    }
  }

  private navigateJob(id: number): void {
    this.router.navigate(['jobs', 'plate-job', { jobId: id }]);
  }

}
