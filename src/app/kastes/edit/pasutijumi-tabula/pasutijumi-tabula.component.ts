import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KastesJobPartial } from '../../interfaces/kastes-job-partial';
import { KastesPasutijumiService } from '../../services/kastes-pasutijumi.service';
import { getKastesPreferences } from '../../services/kastes-preferences.service';

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

  private activeJob$ = getKastesPreferences('pasutijums');

  datasource$: Observable<KastesJobTable[]> = combineLatest([
    this.kastesJobsService.kastesJobs$,
    this.activeJob$,
  ]).pipe(
    map(
      ([jobs, act]) => jobs.map(job => ({ ...job, active: job.jobId === act }))
    ),
  );

  constructor(
    private kastesJobsService: KastesPasutijumiService,
  ) { }

  ngOnInit(): void {
    this.kastesJobsService.setFilter({});
  }

  onFilter(name: string): void {
    const filter = name.length > 0 ? { name } : {};
    this.kastesJobsService.setFilter(filter);
  }

}
