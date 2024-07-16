import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { InvoicesTotals } from '../../interfaces';
import { DenseListDirective } from 'src/app/library/dense-list/dense-list.directive';

@Component({
  selector: 'app-selection-totals',
  standalone: true,
  templateUrl: './selection-totals.component.html',
  styleUrls: ['./selection-totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule, CurrencyPipe, DenseListDirective],
})
export class SelectionTotalsComponent {
  @Input()
  invoicesTotals: InvoicesTotals | null = null;
}
