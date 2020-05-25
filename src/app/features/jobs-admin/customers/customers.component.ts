import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RouteSelection } from 'src/app/library/find-select-route/find-select-route.module';
import { Customer } from 'src/app/interfaces';
import { CustomersService } from '../services/customers.service';
import { map, filter } from 'rxjs/operators';
import * as customersSelectors from 'src/app/store/selectors/customers.selectors';
import * as customersActions from 'src/app/store/actions/customers.actions';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {


  constructor(
    private service: CustomersService,
    private store: Store,
  ) { }

  customers$: Observable<RouteSelection[]> = this.store.select(customersSelectors.customers).pipe(
    filter(customers => !!customers),
    map(customers => customers.map(cust => ({
      title: !cust.CustomerName.length ? 'Bez nosaukuma' : cust.CustomerName,
      link: ['edit', { id: cust._id }],
    })),
      map(this.addNewEntry),
    )
  );
  // this.service.customers$.pipe(
  //   map(customers => customers.map(cust => ({
  //     title: !cust.CustomerName.length ? 'Bez nosaukuma' : cust.CustomerName,
  //     link: ['edit', { id: cust._id }],
  //   }))
  //   ),
  //   map(this.addNewEntry),
  // );

  ngOnInit(): void {
    this.store.dispatch(customersActions.getList());
  }

  private addNewEntry(rts: RouteSelection[]): RouteSelection[] {
    return rts.concat([{
      title: '>Jauns klients<',
      link: ['new'],
    }]);
  }

}
