import { ChangeDetectionStrategy, Component, computed, effect, inject, model, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DestroyService } from 'src/app/library/rxjs';
import { LoginService } from 'src/app/login';
import { ScrollTopDirective } from '../../library/scroll-to-top/scroll-top.directive';
import { JobsProduction, JobsProductionFilterQuery } from '../interfaces';
import { FilterComponent } from './filter/filter.component';
import { ProductsTableComponent } from './products-table/products-table.component';
import { ProductsProductionService } from './services/products-production.service';
import { Totals } from './services/totals';

@Component({
  selector: 'app-products-production',
  templateUrl: './products-production.component.html',
  styleUrls: ['./products-production.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  standalone: true,
  imports: [
    FilterComponent,
    ProductsTableComponent,
    ScrollTopDirective,
  ],
})
export class ProductsProductionComponent {

  private productsService = inject(ProductsProductionService);
  private loginService = inject(LoginService);

  private data$ = this.productsService.dataFlow();

  isAdmin = signal(false);

  query = this.productsService.query;

  // sort = this.productsService.sort;

  // filter = this.productsService.filter;

  selection = signal<JobsProduction[]>([]);

  data = toSignal(this.data$, { initialValue: [] });

  totals = computed(() => {
    const selection = this.selection();
    return selection.reduce(
      (acc, curr) => acc.add(curr),
      new Totals(),
    );
  });


  constructor() {

    this.loginService.isModuleAvailable('jobs-admin')
      .then(value => this.isAdmin.set(value));

    effect(() => {
      const products = this.data();
      this.selection.set(products);
    }, { allowSignalWrites: true });

  }

  async onSort(sort: string) {
    console.log('sort: ', sort);
    this.productsService.setSort(sort);
  }

  async onFilter(filter: JobsProductionFilterQuery) {
    console.log('filter', filter);
    this.productsService.setFilter(filter);
  }

}
