import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { MaterialPrice } from 'src/app/interfaces';
import { log } from 'prd-cdk';

@Component({
  selector: 'app-materials-prices',
  templateUrl: './materials-prices.component.html',
  styleUrls: ['./materials-prices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsPricesComponent implements OnInit {

  @Input() pricesArray!: FormArray;

  @Input() units: string = '';

  @Output() deletePrice = new EventEmitter<number>();
  @Output() editPrice = new EventEmitter<number>();

  data$: Observable<MaterialPrice[]>;

  displayedColumns = [
    'minMax',
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
