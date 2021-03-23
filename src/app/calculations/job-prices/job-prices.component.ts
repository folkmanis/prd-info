import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { JobService } from 'src/app/services/job.service';
import { Job, JobPartial, JobQueryFilter } from 'src/app/interfaces';

@Component({
  selector: 'app-job-prices',
  templateUrl: './job-prices.component.html',
  styleUrls: ['./job-prices.component.scss']
})
export class JobPricesComponent implements OnInit {

  jobs$: Observable<JobPartial[]> = this.jobService.jobs$;

  constructor(
    private jobService: JobService,
  ) { }

  ngOnInit(): void {
    this.jobService.setFilter({ invoice: 0, unwindProducts: 1 });
  }

}
