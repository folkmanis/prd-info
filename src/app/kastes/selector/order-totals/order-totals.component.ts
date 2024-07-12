import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { COLORS, Colors } from '../../interfaces';
import { totalsByColor, totalsBySize } from '../../services/item-packing.utilities';
import { kastesPreferences } from '../../services/kastes-preferences.service';

type OrderTotalsInput = Record<Colors, number> & {
  total: number;
};

@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrls: ['./order-totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OrderTotalsComponent {
  colors = COLORS;

  colorCodes = kastesPreferences('colors');

  packages = input.required<OrderTotalsInput[]>();

  totalsBySize = computed(() => totalsBySize(this.packages()));

  colorTotals = computed(() => totalsByColor(this.packages()));
}
