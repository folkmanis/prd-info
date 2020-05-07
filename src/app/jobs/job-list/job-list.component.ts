import { Component, OnInit } from '@angular/core';
import { JobService } from '../services';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {

  constructor(
    private jobService: JobService,
  ) { }

  dataSource$ = this.jobService.jobs$;
  displayedColumns: string[] = ['buttons', 'jobId', 'receivedDate', 'customer', 'name', 'customerJobId', 'invoiceId'];

  ngOnInit(): void {
  }

}