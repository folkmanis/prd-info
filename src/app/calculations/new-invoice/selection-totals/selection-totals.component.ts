import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { InvoicesTotals } from '../../interfaces';
import { MatListModule } from '@angular/material/list';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-selection-totals',
  standalone: true,
  templateUrl: './selection-totals.component.html',
  styleUrls: ['./selection-totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatListModule,
    NgIf,
    NgFor,
    CurrencyPipe,
  ]
})
export class SelectionTotalsComponent {

  @Input()
  invoicesTotals: InvoicesTotals | null = null;

}
