import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { JobPartial } from 'src/app/interfaces';

@Component({
  selector: 'app-job-prices-table',
  templateUrl: './job-prices-table.component.html',
  styleUrls: ['./job-prices-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobPricesTableComponent implements OnInit {

  jobs$ = this.route.data;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.jobs$.subscribe(jobs => console.log('jobs', jobs));
  }

}
