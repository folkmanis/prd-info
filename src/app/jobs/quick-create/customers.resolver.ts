import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CustomerList } from 'src/app/interfaces';
import { resolveCatching } from 'src/app/library/guards';
import { CustomersService } from 'src/app/services';

export const customersResolver: ResolveFn<CustomerList[]> = (_, state) => {
  return resolveCatching(state.url, () => inject(CustomersService).getCustomerList({ disabled: false }));
};
