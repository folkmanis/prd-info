import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { KastesTotalsComponent, kastesTotalsFromVeikali } from '../../common';
import { COLORS, Veikals } from '../../interfaces';
import { getKastesPreferences } from '../../services/kastes-preferences.service';
import { CommonModule } from '@angular/common';
import { ActiveVeikalsDirective } from './active-veikals.directive';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { TotalsComponent } from './totals/totals.component';
import { VeikalsEditComponent } from './veikals-edit/veikals-edit.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pakosanas-saraksts',
  standalone: true,
  templateUrl: './pakosanas-saraksts.component.html',
  styleUrls: ['./pakosanas-saraksts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ActiveVeikalsDirective,
    MatTableModule,
    KastesTotalsComponent,
    MatIconModule,
    TotalsComponent,
    VeikalsEditComponent,
    MatButtonModule,
  ]
})
export class PakosanasSarakstsComponent implements OnInit {

  colors$ = getKastesPreferences('colors');

  dataSource$ = new BehaviorSubject<Veikals[]>([]);

  kastesTotals$: Observable<[number, number][]> = this.dataSource$.pipe(
    map(veikali => kastesTotalsFromVeikali(veikali)),
  );

  displayedColumnsTop = ['kods', 'adrese', 'pakas'];
  displayedColumnsBottom = ['spacer', 'buttons', 'editor'];

  edited: Veikals | null = null;

  @Input() set veikali(veikali: Veikals[]) {
    this.edited = null;
    this.dataSource$.next(veikali || []);
  }

  private _disabled = false;
  @Input()
  set disabled(disabled: any) {
    this._disabled = coerceBooleanProperty(disabled);
  }
  get disabled() {
    return this._disabled;
  }

  @Output() veikalsChange = new EventEmitter<Veikals>();

  readonly colors = COLORS;


  ngOnInit(): void {
  }

  onSaveVeikals(veikals: Veikals) {
    this.veikalsChange.next(veikals);
  }

  isDisabled(veikals: Veikals): boolean {
    return this.disabled || veikals.kastes.every(k => k.gatavs);
  }

}
