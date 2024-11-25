import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
  imports: [FilterComponent, ProductsTableComponent, ScrollTopDirective],
})
export class ProductsProductionComponent {
  private productsService = inject(ProductsProductionService);
  private loginService = inject(LoginService);

  private data$ = this.productsService.dataFlow();

  isAdmin = toSignal(this.loginService.isModuleAvailable('jobs-admin'), { initialValue: false });

  query = this.productsService.query;

  selection = signal<JobsProduction[]>([]);

  data = toSignal(this.data$, { initialValue: [] });

  totals = computed(() => {
    const selection = this.selection();
    return selection.reduce((acc, curr) => acc.add(curr), new Totals());
  });

  constructor() {
    effect(() => {
      this.selection.set(this.data());
    });
  }

  async onSort(sort: string) {
    this.productsService.setSort(sort);
  }

  async onFilter(filter: JobsProductionFilterQuery) {
    this.productsService.setFilter(filter);
  }
}
