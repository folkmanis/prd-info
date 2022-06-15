import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, UntypedFormArray } from '@angular/forms';
import { merge, Observable } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { MaterialPrice } from 'src/app/interfaces';
import { log, DestroyService } from 'prd-cdk';
import { MaterialPriceGroup } from '../../services/materials-form-source';

@Component({
  selector: 'app-materials-prices',
  templateUrl: './materials-prices.component.html',
  styleUrls: ['./materials-prices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsPricesComponent implements OnInit {

  @Input() pricesArray!: UntypedFormArray;

  @Input() units: string = '';

  @Output() deletePrice = new EventEmitter<number>();
  @Output() editPrice = new EventEmitter<number>();

  data$: Observable<MaterialPrice[]>;
  trackBy = (idx: number): any => this.pricesArray.controls[idx];

  isDuplicate = (idx: number): boolean => {
    return this.pricesArray.hasError('duplicates') && (this.pricesArray.getError('duplicates') as MaterialPriceGroup[]).includes(this.pricesArray.at(idx) as MaterialPriceGroup);
  };

  displayedColumns = [
    'min',
    'price',
    'description',
    'actions',
  ];

  constructor() { }

  ngOnInit(): void {
    this.data$ = this.pricesArray.valueChanges.pipe(
      startWith(this.pricesArray.value),
    );
  }

  onEditPrice(idx: number) {
    this.editPrice.next(idx);
  }

  onDeletePrice(idx: number) {
    this.deletePrice.next(idx);
  }


}
