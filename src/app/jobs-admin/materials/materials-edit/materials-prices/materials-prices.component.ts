import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { filter, map, Observable } from 'rxjs';
import { MaterialPrice } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { DialogData, MaterialsPriceDialogComponent } from '../materials-price-dialog/materials-price-dialog.component';
import { MaterialsPricesDataSource } from './materials-prices-data-source';

@Component({
  selector: 'app-materials-prices',
  templateUrl: './materials-prices.component.html',
  styleUrls: ['./materials-prices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatButtonModule, MatIconModule, CurrencyPipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MaterialsPricesComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: MaterialsPricesComponent,
      multi: true,
    },
  ],
})
export class MaterialsPricesComponent implements ControlValueAccessor, Validator {
  private dialogService = inject(MatDialog);
  private transformer = inject(AppClassTransformerService);

  dataSource = new MaterialsPricesDataSource();

  displayedColumns = ['min', 'price', 'description', 'actions'];

  disabled = false;

  readonly units = input<string>('');

  onTouchFn: () => void = () => {};

  isDuplicate = (price: number): boolean => {
    const dup: number[] | undefined = this.dataSource.errors?.duplicates;
    return !!dup && dup.includes(price);
  };

  writeValue(obj: MaterialPrice[]): void {
    this.dataSource.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.dataSource.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(): ValidationErrors | null {
    return this.dataSource.errors;
  }

  onAddPrice() {
    this.onTouchFn();
    this.openEditor(new MaterialPrice()).subscribe((data) => {
      this.dataSource.addPrice(data);
    });
  }

  onEditPrice(value: MaterialPrice, idx: number) {
    this.onTouchFn();
    this.openEditor(value).subscribe((data) => this.dataSource.updatePrice(data, idx));
  }

  onDeletePrice(index: number) {
    this.onTouchFn();
    this.dataSource.deletePrice(index);
  }

  private openEditor(price: MaterialPrice): Observable<MaterialPrice> {
    const data: DialogData = {
      value: price,
      units: this.units(),
    };
    return this.dialogService
      .open<MaterialsPriceDialogComponent, DialogData, Record<string, any>>(MaterialsPriceDialogComponent, { data })
      .afterClosed()
      .pipe(
        filter((response) => !!response),
        map((response) => this.transformer.plainToInstance(MaterialPrice, response)),
      );
  }
}
