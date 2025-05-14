import { A11yModule } from '@angular/cdk/a11y';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, booleanAttribute, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { COLORS } from 'src/app/interfaces';
import { KeyPressDirective } from 'src/app/library/directives/key-press.directive';
import { kastesTotalsFromVeikali } from '../../common/color-totals-from-veikali';
import { KastesTotalsComponent } from '../../common/kastes-totals/kastes-totals.component';
import { Veikals } from '../../interfaces';
import { kastesPreferences } from '../../services/kastes-preferences.service';
import { VeikalsValidationErrors } from '../services/veikals-validation-errors';
import { TotalsComponent } from './totals/totals.component';
import { VeikalsEditComponent } from './veikals-edit/veikals-edit.component';

@Component({
  selector: 'app-pakosanas-saraksts',
  templateUrl: './pakosanas-saraksts.component.html',
  styleUrls: ['./pakosanas-saraksts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, KastesTotalsComponent, MatIconModule, TotalsComponent, VeikalsEditComponent, MatButtonModule, TitleCasePipe, AsyncPipe, A11yModule, KeyPressDirective],
})
export class PakosanasSarakstsComponent {
  colorCodes = kastesPreferences('colors');

  dataSource$ = new BehaviorSubject<Veikals[]>([]);

  kastesTotals$: Observable<[number, number][]> = this.dataSource$.pipe(map((veikali) => kastesTotalsFromVeikali(veikali)));

  displayedColumnsTop = ['kods', 'adrese', 'pakas'];
  displayedColumnsBottom = ['spacer', 'buttons', 'editor'];

  edited: Veikals | null = null;

  errors = signal<VeikalsValidationErrors | null>(null);

  veikalsUpdate: Veikals | null = null;

  @Input() set veikali(veikali: Veikals[]) {
    this.edited = null;
    this.dataSource$.next(veikali || []);
  }

  disabled = input(false, { transform: booleanAttribute });

  @Output() veikalsChange = new EventEmitter<Veikals>();

  readonly colors = COLORS;

  onSaveVeikals() {
    if (this.veikalsUpdate && !this.errors()) {
      this.veikalsChange.next(this.veikalsUpdate);
      this.veikalsUpdate = null;
    }
  }

  isDisabled(veikals: Veikals): boolean {
    return this.disabled() || this.edited !== null || veikals.kastes.every((k) => k.gatavs);
  }
}
