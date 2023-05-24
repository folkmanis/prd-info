import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';
import { CustomerPartial } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services/customers.service';

export const resolveCustomers: ResolveFn<CustomerPartial[]> = () =>
    inject(CustomersService).getCustomerList().pipe(
        map(customers => customers.filter(customer => !customer.disabled))
    );