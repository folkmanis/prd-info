import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
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
export class ProductsTableComponent {

  selector = new SelectionModel<JobsProduction>(true);

  readonly data$ = new BehaviorSubject<JobsProduction[]>([]);

  @Input() set data(value: JobsProduction[]) {
    if (value instanceof Array) {
      this.data$.next(value);
    }
  }
  get data() {
    return this.data$.value;
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
