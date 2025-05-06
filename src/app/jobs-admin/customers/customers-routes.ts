import { Route } from '@angular/router';
import { canComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { resolveCustomer } from './services/customer-resolver';
import { inject } from '@angular/core';
import { CustomersService } from 'src/app/services';

export default [
  {
    path: '',
    component: CustomersListComponent,
    children: [
      {
        path: 'new',
        component: CustomerEditComponent,
        canDeactivate: [canComponentDeactivate],
        resolve: {
          customer: () => inject(CustomersService).newCustomer(),
        },
      },
      {
        path: ':id',
        component: CustomerEditComponent,
        canDeactivate: [canComponentDeactivate],
        resolve: {
          customer: resolveCustomer,
        },
        runGuardsAndResolvers: 'always',
      },
    ],
  },
] as Route[];
