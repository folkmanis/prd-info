import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTable as MatTable } from '@angular/material/legacy-table';
import { ClassTransformer } from 'class-transformer';
import { filter, map, Observable } from 'rxjs';
import { MaterialPrice } from 'src/app/interfaces';
import { DialogData, MaterialsPriceDialogComponent } from '../materials-price-dialog/materials-price-dialog.component';
import { MaterialsPricesDataSource } from './materials-prices-data-source';


@Component({
  selector: 'app-materials-prices',
  templateUrl: './materials-prices.component.html',
  styleUrls: ['./materials-prices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    }
  ]
})
export class MaterialsPricesComponent implements OnInit, ControlValueAccessor, Validator {

  dataSource = new MaterialsPricesDataSource();

  displayedColumns = [
    'min',
    'price',
    'description',
    'actions',
  ];

  @ViewChild(MatTable) private table: MatTable<MaterialPrice>;

  disabled = false;

  @Input() units: string = '';

  onTouchFn: () => void = () => { };

  isDuplicate = (price: number): boolean => {
    const dup: number[] | undefined = this.dataSource.errors?.duplicates;
    return dup && dup.includes(price);
  };

  constructor(
    private dialogService: MatDialog,
    private chDetector: ChangeDetectorRef,
    private transformer: ClassTransformer,
  ) { }

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

  validate(): ValidationErrors {
    return this.dataSource.errors;
  }

  ngOnInit(): void {
  }

  onAddPrice() {
    this.onTouchFn();
    this.openEditor(new MaterialPrice())
      .subscribe(data => {
        this.dataSource.addPrice(data);
      });
  }

  onEditPrice(value: MaterialPrice, idx: number) {
    this.onTouchFn();
    this.openEditor(value)
      .subscribe(data => this.dataSource.updatePrice(data, idx));
  }


  onDeletePrice(index: number) {
    this.onTouchFn();
    this.dataSource.deletePrice(index);
  }

  private openEditor(price: MaterialPrice): Observable<MaterialPrice> {
    const data: DialogData = {
      value: price,
      units: this.units,
    };
    return this.dialogService.open<MaterialsPriceDialogComponent, DialogData, Record<string, any>>(
      MaterialsPriceDialogComponent,
      { data }
    )
      .afterClosed()
      .pipe(
        filter(data => !!data),
        map(data => this.transformer.plainToInstance(MaterialPrice, data))
      );
  }



}
