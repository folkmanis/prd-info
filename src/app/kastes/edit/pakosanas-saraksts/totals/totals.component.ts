import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Veikals } from 'src/app/kastes/interfaces';
import { kastesPreferences } from 'src/app/kastes/services/kastes-preferences.service';
import { PlusSignPipe } from 'prd-cdk';
import { colorTotalsFromVeikalsBoxs } from 'src/app/kastes/common/color-totals-from-veikali';
import { VeikalsValidationErrors } from '../../services/veikals-validation-errors';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PlusSignPipe],
})
export class TotalsComponent {
  colors = kastesPreferences('colors');

  veikals = input<Veikals | null>(null);

  errors = input<VeikalsValidationErrors | null>(null);

  colorTotals = computed(() => {
    const v = this.veikals();
    return v ? colorTotalsFromVeikalsBoxs(v.kastes) : [];
  });

  veikalsTotal = computed(() => this.colorTotals().reduce((acc, curr) => acc + curr.total, 0));

  errorDiff = computed(() => this.errors()?.diff ?? {});
}
