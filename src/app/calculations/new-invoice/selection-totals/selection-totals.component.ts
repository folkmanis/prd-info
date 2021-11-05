import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { InvoicesTotals } from '../../interfaces';

@Component({
  selector: 'app-selection-totals',
  templateUrl: './selection-totals.component.html',
  styleUrls: ['./selection-totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionTotalsComponent {

  @Input() invoicesTotals: InvoicesTotals = { totals: [], grandTotal: 0 };

}
