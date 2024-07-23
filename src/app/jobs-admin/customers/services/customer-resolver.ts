import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Customer } from 'src/app/interfaces';
import { resolveCatching } from 'src/app/library/guards';
import { CustomersService } from 'src/app/services';

export const resolveCustomer: ResolveFn<Customer> = async (route, state) => {
  return resolveCatching(state.url, () => inject(CustomersService).getCustomer(route.paramMap.get('id')));
};
