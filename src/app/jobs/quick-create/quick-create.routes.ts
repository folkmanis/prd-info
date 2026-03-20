import { Route } from '@angular/router';
import { customersResolver } from './customers.resolver';
import { productsResolver } from './products.resolver';
import { QuickCreateComponent } from './quick-create.component';

export default [
  {
    path: '',
    pathMatch: 'full',
    component: QuickCreateComponent,
    resolve: {
      products: productsResolver,
      customers: customersResolver,
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
] as Route[];
