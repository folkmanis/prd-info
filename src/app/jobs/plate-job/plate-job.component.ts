import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Job } from 'src/app/interfaces';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-plate-job',
  templateUrl: './plate-job.component.html',
  styleUrls: ['./plate-job.component.css']
})
export class PlateJobComponent implements OnInit {

  private activeJob: Partial<Job>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
  ) { }

  loadedJob$: Observable<Partial<Job>> = this.route.paramMap.pipe(
    map(param => param.get('jobId') as string | undefined),
    switchMap(jobId => jobId ? this.jobService.getJob(+jobId) : of({ jobId: undefined })),
    tap(job => this.activeJob = job),
  );

  ngOnInit(): void {
  }

  onjobUpdate(event: Partial<Job>) {
    if (this.activeJob.jobId) {
      this.jobService.updateJob({ ...this.activeJob, ...event }).pipe(
        tap(() => this.navigateJob(this.activeJob.jobId)),
      ).subscribe();
    } else {
      this.jobService.newJob(event).pipe(
        tap(id => this.navigateJob(id)),
      ).subscribe();
    }
  }

  private navigateJob(id: number): void {
    this.router.navigate(['jobs', 'plate-job', { jobId: id }]);
  }

}
