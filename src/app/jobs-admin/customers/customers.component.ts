import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouteSelection } from 'src/app/library/find-select-route/find-select-route.module';
import { CustomersService } from 'src/app/services';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
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
    map(rts => [
      {
        title: '> Jauns klients <',
        link: ['new'],
      },
      ...rts,
    ]),
  );

  ngOnInit(): void {
  }

}
