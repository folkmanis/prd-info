import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Colors, COLORS } from 'src/app/interfaces';
import { totalsByColor } from '../../services/item-packing.utilities';
import { kastesPreferences } from '../../services/kastes-preferences.service';

type TotalsInput = Record<Colors, number> & {
  hasLabel: boolean;
  completed: boolean;
};

@Component({
  selector: 'app-totals-for-selected-size',
  imports: [TitleCasePipe],
  templateUrl: './totals-for-selected-size.component.html',
  styleUrl: './totals-for-selected-size.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
