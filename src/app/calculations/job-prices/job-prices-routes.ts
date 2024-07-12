import { Route } from '@angular/router';
import { JobPricesComponent } from './job-prices.component';
import { resolveJobData } from './jobs-resolver';
import { resolveCustomers } from './customers-resolver';

export default [
  {
    path: '',
    component: JobPricesComponent,
    resolve: {
      jobs: resolveJobData,
      customers: resolveCustomers,
    },
    runGuardsAndResolvers: 'always',
  },
] as Route[];
