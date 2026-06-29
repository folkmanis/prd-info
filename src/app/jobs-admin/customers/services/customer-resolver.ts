import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Customer } from 'src/app/interfaces';
import { ValidatorService } from 'src/app/library';
import { resolveCatching } from 'src/app/library/guards';
import { CustomersService } from 'src/app/services';

export const resolveCustomer: ResolveFn<Customer> = (route, state) => {
  const id = inject(ValidatorService).validateId(route.paramMap.get('id'));
  console.log(id);
  return resolveCatching(state.url, () => inject(CustomersService).getCustomer(id));
};
