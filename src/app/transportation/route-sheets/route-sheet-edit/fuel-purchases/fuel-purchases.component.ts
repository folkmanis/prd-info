import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatDivider, MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { ConfirmationDirective } from 'src/app/library/confirmation-dialog';
import { updateCatching } from 'src/app/library/update-catching';
import { configuration } from 'src/app/services/config.provider';
import { TransportationRouteSheet } from 'src/app/transportation/interfaces/transportation-route-sheet';
import { RouteSheetService } from 'src/app/transportation/services/route-sheet.service';
import { FuelPurchase } from '../../../interfaces/fuel-purchase';
import { FuelTotalsComponent } from '../../../ui/fuel-totals/fuel-totals.component';
import { FuelPurchaseDialogData, SinglePurchaseComponent } from './single-purchase/single-purchase.component';

function sortByDate(values: FuelPurchase[]): FuelPurchase[] {
  const update = [...values];
  update.sort((a, b) => a.date.getTime() - b.date.getTime());
  return update;
}

@Component({
  selector: 'app-fuel-purchases',
  imports: [
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuelPurchasesComponent {
  readonly #routeSheetService = inject(RouteSheetService);
  readonly #dialog = inject(MatDialog);

  #fuelTypes = configuration('transportation', 'fuelTypes');

  routeSheet = input.required<TransportationRouteSheet>();
  protected fuelPurchases = linkedSignal(() => this.routeSheet().fuelPurchases, { equal: isEqual });

  protected busy = signal(false);
  readonly #updateFn = updateCatching(this.busy);

  protected fuelDescription = (type: string) => this.#fuelTypes()?.find((t) => t.type === type)?.description || '';

  onSortByDate() {
    if (this.fuelPurchases().length < 2 || this.busy()) {
      return;
    }

    const update = sortByDate(this.fuelPurchases());
    if (!isEqual(this.fuelPurchases(), update)) {
      this.fuelPurchases.set(update);
      this.#saveFuelPurchases();
    }
  }

  async editFuelPurchase(idx: number) {
    const data = this.#createDialogData(this.fuelPurchases()[idx]);

    const result = await firstValueFrom(this.#dialog.open(SinglePurchaseComponent, { data }).afterClosed());
    if (result) {
      this.fuelPurchases.update((fps) => fps.map((fp, i) => (i === idx ? result : fp)));
      await this.#saveFuelPurchases();
    }
  }

  async appendFuelPurchase() {
    const { year, month } = this.routeSheet();
    const {
      vehicle: {
        fuelType: { type, units },
      },
    } = this.routeSheet();
    const data = this.#createDialogData({
      date: new Date(year, month - 1),
      type,
      units,
      amount: 0,
      price: 0,
      total: 0,
      invoiceId: null,
    });
    const result = await firstValueFrom(this.#dialog.open(SinglePurchaseComponent, { data }).afterClosed());
    if (result) {
      this.fuelPurchases.update((fps) => [...fps, result]);
      await this.#saveFuelPurchases();
    }
  }

  async deleteFuelPurchase(idx: number) {
    this.fuelPurchases.update((fps) => fps.filter((_, i) => i !== idx));
    await this.#saveFuelPurchases();
  }

  async #saveFuelPurchases() {
    const { _id: id } = this.routeSheet();
    const update = { fuelPurchases: this.fuelPurchases() };
    this.#updateFn(async (message) => {
      const { fuelPurchases } = await this.#routeSheetService.updateRouteSheet(id, update);
      this.fuelPurchases.set(fuelPurchases);
      message(`Izmaiņas saglabātas`);
    });
  }

  #createDialogData(fuelPurchase: FuelPurchase): FuelPurchaseDialogData {
    const { year, month } = this.routeSheet();
    return {
      fuelPurchase,
      defaultFuelType: this.routeSheet().vehicle.fuelType,
      year,
      month,
    };
  }
}
