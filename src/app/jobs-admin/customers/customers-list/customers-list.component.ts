import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomersService } from 'src/app/services';
import { LayoutService } from 'src/app/layout/layout.service';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit, OnDestroy {

  constructor(
    private customersService: CustomersService,
    private layOutService: LayoutService,
  ) { }
  readonly filter$ = new BehaviorSubject<string>('');

  customers$ = combineLatest([
    this.filter$.pipe(
      debounceTime(200),
      map(str => str.toUpperCase()),
    ),
    this.customersService.customers$
  ]).pipe(
    map(([fltr, cust]) => cust.filter(c => c.CustomerName.toUpperCase().includes(fltr)))
  );
  large$ = this.layOutService.isLarge$;
  displayedColumns = ['CustomerName'];

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.filter$.complete();
  }

}
