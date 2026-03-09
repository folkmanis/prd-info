import { Route } from '@angular/router';
import { QuickCreateComponent } from './quick-create.component';
import { productsResolver } from './products.resolver';
import { customersResolver } from './customers.resolver';

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
