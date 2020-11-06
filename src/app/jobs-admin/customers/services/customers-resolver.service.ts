import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Customer, NewCustomer } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomersResolverService implements Resolve<Customer> {

  constructor(
    private router: Router,
    private customersService: CustomersService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Customer> | Observable<never> | undefined {
    const id: string = route.paramMap.get('id');
    if (!id || id.length !== 24) {
      this.cancelNavigation();
      return;
    }
    return this.customersService.getCustomer(id).pipe(
      mergeMap(cust => {
        if (cust) {
          return of(cust);
        } else {
          this.cancelNavigation();
          return EMPTY;
        }
      })
    );
  }

  private cancelNavigation() {
    this.router.navigate(['jobs-admin', 'customers']);
  }

}
