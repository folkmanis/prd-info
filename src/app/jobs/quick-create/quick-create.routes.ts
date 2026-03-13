import { Route } from '@angular/router';
import { QuickCreateComponent } from './quick-create.component';
import { productsResolver } from './products.resolver';
import { customersResolver } from './customers.resolver';
import { initialJobResolver } from './initial-job.resolver';

export default [
  {
    path: '',
    pathMatch: 'full',
    component: QuickCreateComponent,
    resolve: {
      products: productsResolver,
      customers: customersResolver,
      initialJob: initialJobResolver,
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
] as Route[];
