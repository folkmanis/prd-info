import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoginService } from 'src/app/login';
import { JobsProduction } from '../../interfaces';
import { Totals } from '../services/totals';


const COLUMNS = ['selection', 'name', 'category', 'units', 'count', 'sum'];
const ADMIN_COLUMNS = [...COLUMNS, 'total'];

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsTableComponent implements AfterViewInit {

  @ViewChild(MatSort) private sort: MatSort;

  selector = new SelectionModel<JobsProduction>(true);

  readonly dataSource = new MatTableDataSource<JobsProduction>();

  @Input() set data(value: JobsProduction[]) {
    if (Array.isArray(value)) {
      this.dataSource.data = value;
    }
  }
  get data() {
    return this.dataSource.filteredData;
  }

  @Input()
  initialSort: string;

  @Input()
  totals: Totals = new Totals();

  @Output('sortChange')
  readonly sort$ = new Subject<string>();

  @Input() set selection(value: JobsProduction[]) {
    value = value || [];
    this.selector.setSelection(...value);
  }

  @Output() selectionChange = this.selector.changed.pipe(
    map(change => change.source.selected),
  );

  displayedColumns$ = this.loginService.isModule('jobs-admin').pipe(
    map(isAdmin => isAdmin ? ADMIN_COLUMNS : COLUMNS),
    shareReplay(1),
  );

  constructor(
    private loginService: LoginService,
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onSortChange(value: string) {
    this.sort$.next(value);
  }

  isAllSelected() {
    return this.data.length > 0 && this.selector.selected.length === this.data.length;
  }

  toggleAll() {
    return this.isAllSelected() ? this.selector.clear() : this.selector.setSelection(...this.data);
  }


}
