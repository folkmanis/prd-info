import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { map, Observable, ReplaySubject } from 'rxjs';
import { InvoiceProduct } from 'src/app/interfaces';
import { LoginService } from 'src/app/login';

@Component({
  selector: 'app-invoice-products',
  standalone: true,
  templateUrl: './invoice-products.component.html',
  styleUrls: ['./invoice-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    RouterLink,
    AsyncPipe,
    CurrencyPipe,
  ],
})
export class InvoiceProductsComponent implements OnInit, OnDestroy {

  @Input() set products(products: InvoiceProduct[]) {
    if (!(products instanceof Array)) { return; }
    this.products$.next(products);
  }

  private _total = 0;
  @Input() set total(total: number) {
    this._total = total;
  }
  get total(): number {
    return this._total;
  }

  displayedColumns: (keyof InvoiceProduct)[] = ['paytraqId', '_id', 'count', 'price', 'total'];

  readonly products$ = new ReplaySubject<InvoiceProduct[]>(1);

  isJobsAdmin$: Observable<boolean> = this.loginService.user$.pipe(
    map(usr => usr.preferences.modules.includes('jobs-admin')),
  );

  constructor(
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.products$.complete();
  }

}
