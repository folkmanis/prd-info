import { Component, OnInit, OnDestroy, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { PaytraqProduct } from 'src/app/interfaces/paytraq';

@Component({
  selector: 'app-paytraq-product-table',
  templateUrl: './paytraq-product-table.component.html',
  styleUrls: ['./paytraq-product-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaytraqProductTableComponent implements OnDestroy {

  @Input() set products(products: PaytraqProduct[]) {
    this.products$.next(products);
  }

  @Output() productSelected = new EventEmitter<PaytraqProduct>();

  products$ = new ReplaySubject<PaytraqProduct[]>(1);
  displayedColumns: (keyof PaytraqProduct)[]=['itemID', 'name'];

  constructor() { }

  ngOnDestroy() {
    this.products$.complete();
    this.productSelected.complete();
  }

}
