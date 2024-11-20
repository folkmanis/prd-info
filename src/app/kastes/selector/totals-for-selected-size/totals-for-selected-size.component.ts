import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { COLORS, Colors } from '../../interfaces';
import { kastesPreferences } from '../../services/kastes-preferences.service';
import { totalsByColor } from '../../services/item-packing.utilities';

type TotalsInput = Record<Colors, number> & {
  hasLabel: boolean;
  completed: boolean;
};

@Component({
    selector: 'app-totals-for-selected-size',
    imports: [TitleCasePipe],
    templateUrl: './totals-for-selected-size.component.html',
    styleUrl: './totals-for-selected-size.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalsForSelectedSizeComponent {
  readonly colors = COLORS;

  colorCodes = kastesPreferences('colors');

  packages = input.required<TotalsInput[]>();

  totalPackagesCount = computed(() => this.packages().length);
  notCompletedCount = computed(() => this.packages().reduce((acc, curr) => acc + +!curr.completed, 0));
  notLabelledCount = computed(() => this.packages().reduce((acc, curr) => acc + +!curr.hasLabel, 0));

  colorTotals = computed(() => totalsByColor(this.packages()));
}
