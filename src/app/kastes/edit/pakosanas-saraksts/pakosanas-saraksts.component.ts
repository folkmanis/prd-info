import { Component, OnInit, Input, Output } from '@angular/core';
import { Subject, ReplaySubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { KastesJob, Veikals, COLORS, Colors, ColorTotals } from 'src/app/interfaces';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { VeikalsWithTotals } from '../services/veikals-totals';


@Component({
  selector: 'app-pakosanas-saraksts',
  templateUrl: './pakosanas-saraksts.component.html',
  styleUrls: ['./pakosanas-saraksts.component.scss']
})
export class PakosanasSarakstsComponent implements OnInit {
  @Input() set job(job: KastesJob) {
    if (!job) { return; }
    this._job$.next(job);
  }
  private _job$ = new ReplaySubject<KastesJob>(1);

  colors = COLORS;

  constructor(
    private prefsServices: KastesPreferencesService,
  ) { }

  prefs$ = this.prefsServices.preferences$;

  dataSource$: Observable<VeikalsWithTotals[]> = this._job$.pipe(
    map(job => job.veikali),
    map(veikali => veikali.map(this.veikalsTotals)),
    tap(console.log),
  );

  displayedColumns = ['kods', 'adrese', 'buttons', 'pakas'];

  kastesTotals$: Observable<[number, number][]> = this._job$.pipe(
    map(job => this.kastesTotals(job.veikali)),
  );

  get edited(): VeikalsWithTotals {
    return this._edited;
  }
  set edited(edited: VeikalsWithTotals | undefined) {
    this._edited = edited;
    console.log(this.edited);
  }
  private _edited: VeikalsWithTotals | undefined;

  ngOnInit(): void {
  }

  private kastesTotals(veik: Veikals[]): [number, number][] {
    const totM = new Map<number, number>();
    for (const v of veik) {
      v.kastes.forEach(k => totM.set(k.total, (totM.get(k.total) || 0) + 1));
    }
    return [...totM.entries()];
  }

  private veikalsTotals(veik: Veikals): VeikalsWithTotals {
    const tot = new Map<Colors, number>(COLORS.map(col => [col, 0]));
    for (const k of veik.kastes) {
      COLORS.forEach(c => tot.set(c, tot.get(c) + k[c]));
    }
    return {
      ...veik,
      totals: [...tot.entries()].map(([color, total]) => ({ color, total })),
    };
  }

}
