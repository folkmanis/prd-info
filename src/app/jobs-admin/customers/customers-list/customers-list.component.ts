import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomersService } from 'src/app/services';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { SimpleListContainerComponent } from 'src/app/library/simple-form/simple-list-container/simple-list-container.component';

@Component({
  standalone: true,
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
  imports: [
    MatTableModule,
    RouterLink,
    SimpleListContainerComponent,
  ]
})
export class CustomersListComponent implements OnDestroy {

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
  displayedColumns = ['CustomerName'];


  constructor(
    private customersService: CustomersService,
  ) { }

  ngOnDestroy() {
    this.filter$.complete();
  }

}
