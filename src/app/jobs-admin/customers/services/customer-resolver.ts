import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Customer } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';

export const resolveCustomer: ResolveFn<Customer> = async (route) => {
  const router = inject(Router);
  const customersService = inject(CustomersService);
  try {
    return await customersService.getCustomer(route.paramMap.get('id'));
  } catch (error) {
    const url = router.createUrlTree(['jobs-admin', 'customers']);
    return new RedirectCommand(url);
  }
};
