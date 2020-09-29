import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { PasutijumiService } from '../../services/pasutijumi.service';
import { KastesJobPartial } from 'src/app/interfaces';
import { JobService } from 'src/app/services/job.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-pasutijumi-tabula',
  templateUrl: './pasutijumi-tabula.component.html',
  styleUrls: ['./pasutijumi-tabula.component.css']
})
export class PasutijumiTabulaComponent implements OnInit {

  displayedColumns = ['name', 'receivedDate', 'dueDate'];

  datasource$ = this.jobService.jobs$.pipe(
    map(jobs => jobs.filter(job => job.category === 'perforated paper') as KastesJobPartial[]),
  );

  constructor(
    private jobService: JobService,
  ) { }

  ngOnInit(): void {
    this.jobService.setFilter({ category: 'perforated paper' });
  }

}
