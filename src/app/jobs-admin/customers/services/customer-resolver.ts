import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Customer } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';

export const resolveCustomer: ResolveFn<Customer> = (route) =>
    inject(CustomersService).getCustomer(route.paramMap.get('id'));
