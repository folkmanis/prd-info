import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouteSelection } from 'src/app/library/find-select-route/find-select-route.module';
import { Customer } from 'src/app/interfaces';
import { CustomersService } from '../services/customers.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {


  constructor(
    private service: CustomersService,
  ) { }

  customers$: Observable<RouteSelection[]> = this.service.customers$.pipe(
    map(customers => customers.map(cust => ({
      title: !cust.CustomerName.length ? 'Bez nosaukuma' : cust.CustomerName,
      link: ['edit', { id: cust._id }],
    }))
    ),
    map(this.addNewEntry),
  );

  ngOnInit(): void {
  }

  private addNewEntry(rts: RouteSelection[]): RouteSelection[] {
    return rts.concat([{
      title: '>Jauns klients<',
      link: ['new'],
    }]);
  }

}
