import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

export interface FuelPurchaseTotals {
  amount: number;
  total: number;
  units: string;
}

@Component({
  selector: 'app-total-amount',
  standalone: true,
  imports: [CurrencyPipe, MatChipsModule],
  templateUrl: './total-amount.component.html',
  styleUrl: './total-amount.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalAmountComponent {
  totals = input.required<FuelPurchaseTotals>();
}
