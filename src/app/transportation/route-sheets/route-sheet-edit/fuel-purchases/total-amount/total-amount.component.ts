import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { isObject } from 'lodash-es';
import { FuelPurchase } from 'src/app/transportation/interfaces/transportation-route-sheet';

@Component({
  selector: 'app-total-amount',
  standalone: true,
  imports: [CurrencyPipe, MatChipsModule],
  templateUrl: './total-amount.component.html',
  styleUrl: './total-amount.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalAmountComponent {
  fuelPurchases = input.required<FuelPurchase[]>();

  defaultUnits = input<string>();

  validPurchases = computed(() => this.fuelPurchases().filter(isObject));

  units = computed(() => [...new Set(this.validPurchases().map((fuelPurchase) => fuelPurchase.units))].join(',') || this.defaultUnits());

  totalAmount = computed(() =>
    this.validPurchases()
      .map((fuelPurchase) => fuelPurchase.amount)
      .reduce((total, amount) => total + amount, 0),
  );

  totalCost = computed(() =>
    this.validPurchases()
      .map((fuelPurchase) => fuelPurchase.total)
      .reduce((total, cost) => total + cost, 0),
  );
}
