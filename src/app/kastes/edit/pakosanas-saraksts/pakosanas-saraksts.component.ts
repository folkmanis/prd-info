import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject, ReplaySubject, Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { KastesJob, Veikals, COLORS, Colors, ColorTotals } from 'src/app/interfaces';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';

@Component({
  selector: 'app-pakosanas-saraksts',
  templateUrl: './pakosanas-saraksts.component.html',
  styleUrls: ['./pakosanas-saraksts.component.scss']
})
export class PakosanasSarakstsComponent implements OnInit {
  @Input() set veikali(veikali: Veikals[]) {
    this.edited = undefined;
    if (!veikali) { return; }
    this.dataSource$.next(veikali);
  }

  @Input() set disabled(disabled: any) {
    this._disabled = coerceBooleanProperty(disabled);
  }
  get disabled(): any { return this._disabled; }
  private _disabled = false;

  @Output() veikalsChange = new EventEmitter<Veikals>();

  colors = COLORS;

  constructor(
    private prefsServices: KastesPreferencesService,
  ) { }

  prefs$ = this.prefsServices.preferences$;

  dataSource$ = new BehaviorSubject<Veikals[]>([]);

  kastesTotals$: Observable<[number, number][]> = this.dataSource$.pipe(
    map(veikali => this.kastesTotals(veikali)),
  );

  displayedColumnsTop = ['kods', 'adrese', 'pakas'];
  displayedColumnsBottom = ['spacer', 'buttons', 'editor'];

  edited: Veikals | undefined;

  ngOnInit(): void {
  }

  onSaveVeikals(veikals: Veikals) {
    this.veikalsChange.next(veikals);
  }

  private kastesTotals(veik: Veikals[]): [number, number][] {
    const totM = new Map<number, number>();
    for (const v of veik) {
      v.kastes.forEach(k => totM.set(k.total, (totM.get(k.total) || 0) + 1));
    }
    return [...totM.entries()].sort((a, b) => a[0] - b[0]);
  }

}
