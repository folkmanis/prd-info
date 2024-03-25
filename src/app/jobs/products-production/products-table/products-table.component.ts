import { SelectionModel } from '@angular/cdk/collections';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, model, viewChild } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
  imports: [
    MatTableModule,
    ProductsSortDirective,
    MatCheckboxModule,
    MatSortModule,
    DecimalPipe,
    CurrencyPipe,
  ],
})
export class ProductsTableComponent {

  private sort = viewChild(MatSort);

  selector = new SelectionModel<JobsProduction>(true);

  columns = ['selection', 'name', 'category', 'units', 'count', 'sum'];
  adminColumns = [...this.columns, 'total'];

  readonly dataSource = new MatTableDataSource<JobsProduction>();

  data = input<JobsProduction[]>([]);

  isAdmin = input(false);

  totals = input.required<Totals>();

  selection = input<JobsProduction[]>([]);

  selectionChange$ = this.selector.changed.pipe(
    map(change => change.source.selected),
  );

  selectionChange = outputFromObservable(this.selectionChange$);

  sortString = model('name,1');

  isAllSelected = computed(() => {
    this.data();
    const filteredData = this.dataSource.filteredData;
    return filteredData.length > 0 && this.selector.selected.length === filteredData.length;
  });


  constructor() {
    effect(() => {
      this.dataSource.sort = this.sort();
    });
    effect(() => {
      this.dataSource.data = this.data();
    });
    effect(() => {
      this.selector.setSelection(...this.selection());
    });
  }

  toggleAll() {
    if (this.isAllSelected()) {
      this.selector.clear();
    } else {
      this.selector.setSelection(...this.data());
    }
  }
}
