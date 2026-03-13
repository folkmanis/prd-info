import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoginService } from 'src/app/login';
import { CustomersService } from 'src/app/services';
import { ScrollTopDirective } from '../../library/scroll-to-top/scroll-top.directive';
import { JobsProduction } from '../interfaces';
import { FilterComponent, JobsProductionFilter } from './filter/filter.component';
import { ProductsTableComponent } from './products-table/products-table.component';
import { ProductsProductionService } from './services/products-production.service';
import { Totals } from './services/totals';
import { MatAnchor, MatButton } from '@angular/material/button';

@Component({
  selector: 'app-products-production',
  templateUrl: './products-production.component.html',
  styleUrls: ['./products-production.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilterComponent, ProductsTableComponent, ScrollTopDirective, AsyncPipe, MatAnchor, MatButton],
})
export class ProductsProductionComponent {
  #service = inject(ProductsProductionService);

  protected query = this.#service.getSavedQuery();
  protected data = this.#service.getJobsProductionResource(this.query);

  protected customers = inject(CustomersService).getCustomerList({ disabled: false });

  isAdmin = toSignal(inject(LoginService).isModuleAvailable('jobs-admin'), { initialValue: false });

  selection = signal<JobsProduction[]>([]);

  totals = computed(() => {
    const selection = this.selection();
    return selection.reduce((acc, curr) => acc.add(curr), new Totals());
  });

  constructor() {
    effect(() => {
      if (this.data.hasValue()) {
        this.selection.set(this.data.value());
      }
    });
  }

  onSort(sort: string) {
    const query = this.query();
    if (query) {
      this.#service.setSavedQuery({
        ...query,
        sort,
      });
    }
  }

  async onFilter(filter: JobsProductionFilter | undefined) {
    const query = this.query();
    if (query && filter) {
      this.#service.setSavedQuery({
        ...query,
        ...filter,
      });
    }
  }

  openPrintReport() {
    window.open(this.#service.getReportURL(this.query()), '_blank', 'noopener,noreferrer');
  }
}
