import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { LayoutService } from 'src/app/layout/layout.service';
import { Job, JobPartial, JobQueryFilter } from 'src/app/interfaces';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-repro-job-list',
  templateUrl: './repro-job-list.component.html',
  styleUrls: ['./repro-job-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReproJobListComponent implements OnInit, AfterViewInit {

  large$ = this.layoutService.isLarge$;

  constructor(
    private layoutService: LayoutService,
    private jobService: JobService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.jobService.setFilter({});
  }

}
