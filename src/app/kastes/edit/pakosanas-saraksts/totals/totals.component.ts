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

  @Input() veikals: Veikals | null;

  @Input() errors: VeikalsValidationErrors | null;

  totals() {
    return this.veikals ? colorTotalsFromVeikalsBoxs(this.veikals.kastes) : [];
  }

  veikalsTotal() {
    return this.totals().reduce((acc, curr) => acc + curr.total, 0);
  }
}
