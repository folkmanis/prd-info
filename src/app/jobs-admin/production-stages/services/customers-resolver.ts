import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CustomerPartial } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services/customers.service';

export const resolveCustomers: ResolveFn<CustomerPartial[]> = () =>
  inject(CustomersService).getCustomerList({ disabled: false });
