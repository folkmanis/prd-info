import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { Invoice, InvoiceProduct } from 'src/app/interfaces';
import { Subject, ReplaySubject, from, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
import { LoginService } from 'src/app/services/login.service';

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

  isJobsAdmin$: Observable<boolean> = this.loginService.user$.pipe(
    pluck('preferences', 'modules'),
    map(modules=> modules.includes('jobs-admin'))
  )

  constructor(
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.products$.complete();
  }

}
