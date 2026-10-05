import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatDivider, MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { FuelType } from 'src/app/interfaces';
import { ConfirmationDirective } from 'src/app/library/confirmation-dialog';
import { configuration } from 'src/app/services/config.provider';
import { FuelPurchase } from '../schemas';
import { FuelTotalsComponent } from './fuel-totals/fuel-totals.component';
import { FuelPurchaseDialogData, SinglePurchaseComponent } from './single-purchase/single-purchase.component';

function sortByDate(values: FuelPurchase[]): FuelPurchase[] {
  const update = [...values];
  update.sort((a, b) => a.date.getTime() - b.date.getTime());
  return update;
}

@Component({
  selector: 'app-fuel-purchases',
  imports: [
    MatCardModule,
    MatButton,
    FuelTotalsComponent,
    DatePipe,
    DecimalPipe,
    MatMenuModule,
    MatIcon,
    MatIconButton,
    ConfirmationDirective,
    CurrencyPipe,
    MatListModule,
    MatDivider,
  ],
  templateUrl: './fuel-purchases.component.html',
  styleUrl: './fuel-purchases.component.scss',
})
export class FuelPurchasesComponent {
  readonly #dialog = inject(MatDialog);

  #fuelTypes = configuration('transportation', 'fuelTypes');

  fuelPurchases = input.required<FuelPurchase[]>();

  update = output<FuelPurchase[]>();

  busy = input(false);

  disabled = input(false);

  month = input.required<number>();
  year = input.required<number>();
  fuelType = input.required<FuelType>();

  protected fuelDescription = (type: string) => this.#fuelTypes()?.find((t) => t.type === type)?.description || '';

  onSortByDate() {
    if (this.fuelPurchases().length < 2 || this.busy()) {
      return;
    }

    const update = sortByDate(this.fuelPurchases());
    if (!isEqual(this.fuelPurchases(), update)) {
      this.update.emit(update);
    }
  }

  async editFuelPurchase(idx: number) {
    const data = this.#createDialogData(this.fuelPurchases()[idx]);

    const result = await firstValueFrom(this.#dialog.open(SinglePurchaseComponent, { data }).afterClosed());
    if (result) {
      this.update.emit(this.fuelPurchases().map((fp, i) => (i === idx ? result : fp)));
    }
  }

  async appendFuelPurchase() {
    const { type, units } = this.fuelType();
    const data = this.#createDialogData({
      date: new Date(this.year(), this.month() - 1),
      type,
      units,
      amount: 0,
      price: 0,
      total: 0,
      invoiceId: '',
    });
    const result = await firstValueFrom(this.#dialog.open(SinglePurchaseComponent, { data }).afterClosed());
    if (result) {
      this.update.emit([...this.fuelPurchases(), result]);
    }
  }

  async deleteFuelPurchase(idx: number) {
    this.update.emit(this.fuelPurchases().filter((_, i) => i !== idx));
  }

  #createDialogData(fuelPurchase: FuelPurchase): FuelPurchaseDialogData {
    return {
      fuelPurchase,
      defaultFuelType: this.fuelType(),
      year: this.year(),
      month: this.month(),
    };
  }
}
