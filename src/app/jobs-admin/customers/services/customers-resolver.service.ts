import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Customer } from 'src/app/interfaces';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form';
import { CustomersService } from 'src/app/services';


@Injectable()
export class CustomersResolverService implements Resolve<Customer> {

  constructor(
    private customersService: CustomersService,
    private simpleResolver: SimpleFormResolverService,
  ) { }

  retrieveFnFactory(id: string): RetrieveFn<Customer> {
    return () => {
      if (!id || id.length !== 24) { return of(null); }
      return this.customersService.getCustomer(id);
    };
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Customer> | Observable<never> | undefined {
    const id: string = route.paramMap.get('id');
    return this.simpleResolver.retrieve(
      state,
      this.retrieveFnFactory(id)
    );
  }

}
