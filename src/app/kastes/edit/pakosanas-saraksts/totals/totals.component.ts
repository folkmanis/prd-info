import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal,
} from '@angular/core';
import { Veikals } from 'src/app/kastes/interfaces';
import { getKastesPreferences } from 'src/app/kastes/services/kastes-preferences.service';
import { colorTotalsFromVeikalsBoxs } from '../../../common';
import { PlusSignPipe } from '../../services/plus-sign.pipe';
import { VeikalsValidationErrors } from '../../services/veikals-validation-errors';

@Component({
  selector: 'app-totals',
  standalone: true,
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PlusSignPipe, AsyncPipe],
})
export class TotalsComponent {
  colors$ = getKastesPreferences('colors');

  veikalsSignal = signal<Veikals | null>(null);

  @Input() errors: VeikalsValidationErrors | null;

  @Input() set veikals(value: Veikals) {
    this.veikalsSignal.set(value);
  }

  totals = computed(() =>
    this.veikalsSignal()
      ? colorTotalsFromVeikalsBoxs(this.veikalsSignal().kastes)
      : []
  );

  veikalsTotal = computed(() =>
    this.totals().reduce((acc, curr) => acc + curr.total, 0)
  );
}
