import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { InvoicesTotals } from '../../interfaces';

@Component({
  selector: 'app-selection-totals',
  standalone: true,
  templateUrl: './selection-totals.component.html',
  styleUrls: ['./selection-totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule, CurrencyPipe],
})
export class SelectionTotalsComponent {
  invoicesTotals = input(null as InvoicesTotals | null);
}
