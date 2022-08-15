import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { JobQueryFilter } from '../interfaces';
import { JobService } from '../services/job.service';
import { ReproJobService } from './services/repro-job.service';


@Component({
  selector: 'app-repro-jobs',
  templateUrl: './repro-jobs.component.html',
  styleUrls: ['./repro-jobs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class ReproJobsComponent implements OnInit {

  jobs$ = this.jobService.jobs$;

  highlited: string | null = null;

  constructor(
    private jobService: JobService,
    private reproJobService: ReproJobService,
  ) { }

  ngOnInit(): void {
  }

  onJobFilter(filter: JobQueryFilter) {
    this.jobService.setFilter(filter);
  }

  onProductHover(value: string | null) {
    this.reproJobService.setActiveProduct(value);
  }

}
