import { inject } from '@angular/core';
import { ResolveFn, RouterStateSnapshot } from '@angular/router';
import { EMPTY, mergeMap, of } from 'rxjs';
import { Customer } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';

export const resolveCustomer: ResolveFn<Customer> = (route, state) => {
    const id: string = route.paramMap.get('id');
    return inject(CustomersService).getCustomer(id).pipe(
        mergeMap(cust => cust ? of(cust) : cancelNavigation(state))
    );
};

function cancelNavigation(state: RouterStateSnapshot) {
    this.router.navigate(state.url.split('/').slice(0, -1));
    return EMPTY;
}
