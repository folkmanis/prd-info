import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { Invoice, InvoiceLike, InvoiceProduct } from 'src/app/interfaces';
import { Subject, ReplaySubject, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-invoice-products',
  templateUrl: './invoice-products.component.html',
  styleUrls: ['./invoice-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceProductsComponent implements OnInit, OnDestroy {

  @Input() set products(products: InvoiceProduct[]) {
    if (!(products instanceof Array)) { return; }
    this.products$.next(products);
  }

  @Input() set total(total: number) { this._total = total; }
  get total(): number { return this._total; }
  private _total: number = 0;

  displayedColumns: (keyof InvoiceProduct)[] = ['paytraqId', '_id', 'count', 'price', 'total'];

  readonly products$ = new ReplaySubject<InvoiceProduct[]>(1);

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.products$.complete();
  }

}
