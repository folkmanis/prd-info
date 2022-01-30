import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { map, share, shareReplay, take } from 'rxjs/operators';
import { LoginService } from 'src/app/login';
import { JobsProduction } from '../../interfaces';


const COLUMNS = ['name', 'category', 'units', 'count', 'sum'];
const ADMIN_COLUMNS = [...COLUMNS, 'total'];

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsTableComponent {

  readonly data$ = new ReplaySubject<JobsProduction[]>(1);

  @Input() set data(value: JobsProduction[]) {
    if (value instanceof Array) {
      this.data$.next(value);
    }
  }

  @Input()
  initialSort: string;

  @Output('sortChange')
  readonly sort$ = new Subject<string>();

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



}
