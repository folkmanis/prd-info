import { CurrencyPipe } from '@angular/common';
import { Component, inject, Input, input } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { filter, firstValueFrom, Observable } from 'rxjs';
import { MaterialsService } from '../../services/materials.service';
import { DialogData, MaterialsPriceDialogComponent } from '../materials-price-dialog/materials-price-dialog.component';
import { MaterialPriceModel, newMaterialPrice } from '../../schemas/material-model.schema';
import { FieldTree, ValidationError } from '@angular/forms/signals';

@Component({
  selector: 'app-materials-prices',
  templateUrl: './materials-prices.component.html',
  styleUrls: ['./materials-prices.component.scss'],
  imports: [MatTableModule, MatButtonModule, MatIconModule, CurrencyPipe],
})
export class MaterialsPricesComponent {
  #dialogService = inject(MatDialog);

  @Input({ required: true })
  fieldTree!: FieldTree<MaterialPriceModel[]>;

  readonly units = input<string>('');

  protected displayedColumns = ['min', 'price', 'description', 'actions'];

  async onAddPrice() {
    const newPrice = await this.#openEditor(newMaterialPrice());
    if (newPrice) {
      this.fieldTree().value.update((value) => [...value, newPrice].sort((a, b) => Number(a.min) - Number(b.min)));
      this.fieldTree().markAsDirty();
    }
  }

  protected async onEditPrice(idx: number) {
    const price = this.fieldTree[idx]().value();
    const result = await this.#openEditor(price);
    if (result) {
      this.fieldTree().value.update((value) =>
        value.map((p, i) => (i === idx ? result : p)).sort((a, b) => Number(a.min) - Number(b.min)),
      );
      this.fieldTree().markAsDirty();
    }
  }

  protected onDeletePrice(idx: number) {
    this.fieldTree().value.update((prices) => prices.filter((_, i) => i !== idx));
    this.fieldTree().markAsDirty();
  }

  async #openEditor(price: MaterialPriceModel): Promise<MaterialPriceModel | undefined> {
    const data: DialogData = {
      value: price,
      units: this.units(),
    };
    const response$ = this.#dialogService
      .open<MaterialsPriceDialogComponent, DialogData, MaterialPriceModel>(MaterialsPriceDialogComponent, { data })
      .afterClosed();
    return firstValueFrom(response$);
  }

  protected isDuplicate(errors: ValidationError[]): boolean {
    return errors.some((err) => err.kind === 'duplicate');
  }
}
