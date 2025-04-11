import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { isObject } from 'lodash-es';
import { FuelPurchase } from 'src/app/transportation/interfaces/transportation-route-sheet';

@Component({
  selector: 'app-fuel-totals',
  imports: [CurrencyPipe, MatChipsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuel-totals.component.html',
})
export class FuelTotalsComponent {
  private validPurchases = computed(() => filterValidPurchases(this.fuelPurchases()));

  fuelPurchases = input.required<(FuelPurchase | null)[] | null>();

  defaultUnits = input<string>();

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

function filterValidPurchases(fuelPurchases: (FuelPurchase | null)[] | null): FuelPurchase[] {
  return (fuelPurchases?.filter(isObject) || []) as FuelPurchase[];
}
