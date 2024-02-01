import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { colorTotalsFromVeikali, kastesTotalsFromVeikali } from '../../common';
import { ColorTotals, Colors, VeikalsKaste } from '../../interfaces';

@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrls: ['./order-totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OrderTotalsComponent {
  @Input()
  set veikali(value: VeikalsKaste[]) {
    if (value) {
      this.colorTotals = colorTotalsFromVeikali(value);
      this.apjomiTotals = kastesTotalsFromVeikali(value);
    }
  }
  @Input() colors: { [key in Colors]: string };

  colorTotals: ColorTotals[] = [];
  apjomiTotals: [number, number][] = [];
}
