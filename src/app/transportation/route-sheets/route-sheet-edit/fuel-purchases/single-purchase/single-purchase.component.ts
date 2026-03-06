import { ChangeDetectionStrategy, Component, inject, Signal, signal } from '@angular/core';
import { form, FormField, min, required, submit, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { endOfMonth, startOfMonth } from 'date-fns';
import { isFinite, round } from 'lodash-es';
import { FuelType } from 'src/app/interfaces';
import { computedSignalChanges } from 'src/app/library/signals';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { configuration } from 'src/app/services/config.provider';
import { FuelPurchase } from '../../../../interfaces/fuel-purchase';

export interface FuelPurchaseDialogData {
  fuelPurchase: FuelPurchase;
  defaultFuelType: FuelType;
  year: number;
  month: number;
}

interface FuelModel {
  date: Date;
  type: string;
  units: string;
  amount: number;
  price: number;
  total: number;
  invoiceId: string;
}

@Component({
  selector: 'app-single-purchase',
  imports: [
    MatFormFieldModule,
    MatInput,
    MatDatepickerModule,
    MatSelect,
    MatOption,
    ViewSizeDirective,
    FormField,
    MatButton,
    MatDialogModule,
  ],
  templateUrl: './single-purchase.component.html',
  styleUrl: './single-purchase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SinglePurchaseComponent {
  #dialogRef = inject(MatDialogRef);

  #data = inject<FuelPurchaseDialogData>(MAT_DIALOG_DATA);

  fuelTypes = configuration('transportation', 'fuelTypes');

  protected startDate = startOfMonth(new Date(this.#data.year, this.#data.month - 1));
  protected endDate = endOfMonth(new Date(this.#data.year, this.#data.month - 1));

  #fuelModel = signal<FuelModel>(this.#toModel(this.#data.fuelPurchase));

  protected fuelForm = form(this.#fuelModel, (schema) => {
    required(schema.date);
    validate(schema.date, ({ value }) =>
      value() >= this.startDate && value() <= this.endDate
        ? null
        : { kind: 'invalid_date', message: `Datumam jābūt atskaites mēnesī` },
    );

    required(schema.type);
    required(schema.units);

    required(schema.amount);
    min(schema.amount, 0);

    required(schema.price);
    min(schema.price, 0);

    required(schema.total);
    min(schema.total, 0);
  });

  protected changes = computedSignalChanges(
    this.#fuelModel as Signal<Record<string, any>>,
    signal(this.#toModel(this.#data.fuelPurchase)).asReadonly(),
  );

  onSave() {
    submit(this.fuelForm, async (f) => {
      if (f().valid() === false) {
        return;
      }
      this.#dialogRef.close(this.#fromModel(this.#fuelModel()));
    });
  }

  #toModel(fp: FuelPurchase): FuelModel {
    return {
      ...fp,
      invoiceId: fp.invoiceId ?? '',
    };
  }

  #fromModel(fm: FuelModel): FuelPurchase {
    return {
      ...fm,
      invoiceId: fm.invoiceId || undefined,
    };
  }

  protected onTotalChange() {
    this.#updatePrice();
  }

  protected onAmountChange() {
    this.#updatePrice();
  }

  #updatePrice() {
    const { amount, total } = this.#fuelModel();
    const priceUpdate = isFinite(amount) && isFinite(total) && amount > 0 ? round(total / amount, 3) : NaN;
    this.fuelForm.price().value.set(priceUpdate);
  }
}
