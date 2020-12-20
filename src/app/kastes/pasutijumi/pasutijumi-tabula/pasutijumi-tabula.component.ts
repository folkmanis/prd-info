import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { PasutijumiService } from '../../services/pasutijumi.service';
import { KastesJobPartial } from 'src/app/interfaces';
import { JobService } from 'src/app/services/job.service';
import { LayoutService } from 'src/app/layout/layout.service';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

export interface KastesJobTable extends KastesJobPartial {
  active: boolean;
}

@Component({
  selector: 'app-pasutijumi-tabula',
  templateUrl: './pasutijumi-tabula.component.html',
  styleUrls: ['./pasutijumi-tabula.component.scss']
})
export class PasutijumiTabulaComponent implements OnInit {

  displayedColumns = ['active', 'jobId', 'name', 'receivedDate', 'dueDate'];

  private activeJob$ = this.preferencesService.pasutijumsId$;
  private jobs$ = this.jobService.jobs$.pipe(
    map(jobs => jobs.filter(job => job.category === 'perforated paper') as KastesJobPartial[]),
  );

  datasource$: Observable<KastesJobTable[]> = combineLatest([
    this.jobs$,
    this.activeJob$,
  ]).pipe(
    map(([jobs, act]) => jobs.map(job => ({ ...job, active: job.jobId === act }))),
  );

  constructor(
    private jobService: JobService,
    private pasutijumiService: PasutijumiService,
    private preferencesService: KastesPreferencesService,
    private layOutService: LayoutService,
  ) { }

  large$ = this.layOutService.isLarge$;

  ngOnInit(): void {
    this.jobService.setFilter({ category: 'perforated paper' });
  }

}
