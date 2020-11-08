import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Customer, NewCustomer } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class CustomersResolverService implements Resolve<Customer> {

  constructor(
    private router: Router,
    private customersService: CustomersService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Customer> | Observable<never> | undefined {
    const id: string = route.paramMap.get('id');

    if (!id || id.length !== 24) {
      this.cancelNavigation(state);
      return;
    }
    return this.customersService.getCustomer(id).pipe(
      mergeMap(cust => {
        if (cust) {
          return of(cust);
        } else {
          this.cancelNavigation(state);
          return EMPTY;
        }
      })
    );
  }

  private cancelNavigation(state: RouterStateSnapshot) {
    this.router.navigate(state.url.split('/').slice(0, -1));
  }

}
