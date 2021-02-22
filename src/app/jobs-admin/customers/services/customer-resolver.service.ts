import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form';
import { Customer } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services/customers.service';

@Injectable({
  providedIn: 'any'
})
export class CustomerResolverService extends SimpleFormResolverService<Customer> {

  constructor(
    router: Router,
    private customerService: CustomersService,
  ) { super(router); }

  retrieveFn: RetrieveFn<Customer> = (route) => {
    const id: string = route.paramMap.get('id');
    if (!id || id.length !== 24) { return EMPTY; }
    return this.customerService.getCustomer(id);
  };


}
