import { SelectionModel } from '@angular/cdk/collections';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, model } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { JobsProduction } from '../../interfaces';
import { Totals } from '../services/totals';
import { ProductsSortDirective } from './products-sort.directive';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatTableModule, ProductsSortDirective, MatCheckboxModule, MatSortModule, DecimalPipe, CurrencyPipe],
})
export class ProductsTableComponent {
  selector = new SelectionModel<JobsProduction>(true);

  columns = ['selection', 'name', 'category', 'units', 'count', 'sum'];
  adminColumns = [...this.columns, 'total'];

  data = input<JobsProduction[]>([]);

  isAdmin = input(false);

  totals = input.required<Totals>();

  selection = input<JobsProduction[]>([]);

  selectionChange$ = this.selector.changed.pipe(map((change) => change.source.selected));

  selectionChange = outputFromObservable(this.selectionChange$);

  sortString = model('name,1');

  isAllSelected = computed(() => {
    return this.data().length > 0 && this.selection().length === this.data().length;
  });

  constructor() {
    effect(() => {
      this.selector.setSelection(...this.selection());
    });
  }

  toggleAll() {
    if (this.isAllSelected()) {
      this.selector.clear();
    } else {
      this.selector.select(...this.data());
    }
  }
}
