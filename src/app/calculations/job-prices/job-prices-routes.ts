import { Route } from '@angular/router';
import { JobPricesComponent } from './job-prices.component';
import { JobPricesTableComponent } from './job-prices-table/job-prices-table.component';

export default [
    {
        path: 'job-prices',
        component: JobPricesComponent,
        children: [
            {
                path: ':customer',
                component: JobPricesTableComponent,
            },
            {
                path: '',
                redirectTo: 'all',
                pathMatch: 'full',
            }
        ]
    },
] as Route[];