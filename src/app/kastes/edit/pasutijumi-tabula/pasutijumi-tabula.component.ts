import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { KastesJobPartial } from 'src/app/interfaces';
import { LayoutService } from 'src/app/layout/layout.service';
import { JobService } from 'src/app/services/job.service';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { PasutijumiService } from '../../services/pasutijumi.service';

export interface KastesJobTable extends KastesJobPartial {
  active: boolean;
}

@Component({
  selector: 'app-pasutijumi-tabula',
  templateUrl: './pasutijumi-tabula.component.html',
  styleUrls: ['./pasutijumi-tabula.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasutijumiTabulaComponent implements OnInit {

  readonly columns = ['active', 'jobId', 'name', 'receivedDate', 'dueDate'];
  readonly columnsActive = ['active', 'jobId', 'name'];

  private activeJob$ = this.preferencesService.pasutijumsId$;
  private jobs$ = this.jobService.jobs$.pipe(
    map(jobs => jobs.filter(job => job.category === 'perforated paper') as KastesJobPartial[]),
  );
  filter$ = new BehaviorSubject<string>('');

  datasource$: Observable<KastesJobTable[]> = combineLatest([
    this.jobs$,
    this.activeJob$,
    this.filter$.pipe(
      debounceTime(200),
      map(fltr => fltr.toUpperCase()),
    )
  ]).pipe(
    map(([jobs, act, fltr]) =>
      jobs
        .filter(job => job.name.toUpperCase().includes(fltr))
        .map(job => ({ ...job, active: job.jobId === act }))
    ),
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

  onFilter(fltr): void {
    this.filter$.next(fltr);
  }

}
