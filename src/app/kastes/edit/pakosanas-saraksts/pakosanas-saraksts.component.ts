import { Component, OnInit, Input, Output } from '@angular/core';
import { Subject, ReplaySubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { KastesJob, Veikals, COLORS, Colors, ColorTotals } from 'src/app/interfaces';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { VeikalsWithTotals } from '../services/veikals-totals';
import { PasutijumiService } from '../../services/pasutijumi.service';
import { VeikaliDatasource } from './veikali-datasource';

@Component({
  selector: 'app-pakosanas-saraksts',
  templateUrl: './pakosanas-saraksts.component.html',
  styleUrls: ['./pakosanas-saraksts.component.scss']
})
export class PakosanasSarakstsComponent implements OnInit {
  @Input() set job(job: KastesJob) {
    if (!job) { return; }
    this.dataSource.setJob(job);
  }

  colors = COLORS;

  constructor(
    private prefsServices: KastesPreferencesService,
    private pasService: PasutijumiService,
  ) { }

  prefs$ = this.prefsServices.preferences$;

  dataSource = new VeikaliDatasource(this.pasService);

  displayedColumns = ['kods', 'adrese', 'buttons', 'pakas'];

  edited: Veikals | undefined;

  ngOnInit(): void {
  }

  onSaveVeikals(veikals: Veikals) {
    this.dataSource.updateVeikals(veikals)
      .subscribe();
    console.log(veikals);
    this.edited = undefined;
  }

}
