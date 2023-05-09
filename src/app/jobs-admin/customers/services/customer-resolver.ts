import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { mergeMap, of } from 'rxjs';
import { Customer } from 'src/app/interfaces';
import { cancelNavigation } from 'src/app/library/simple-form';
import { CustomersService } from 'src/app/services';

export const resolveCustomer: ResolveFn<Customer> = (route, state) => {
    const id: string = route.paramMap.get('id');
    return inject(CustomersService).getCustomer(id).pipe(
        mergeMap(cust => cust ? of(cust) : cancelNavigation(state))
    );
};
