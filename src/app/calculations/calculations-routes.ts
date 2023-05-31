import { Route } from '@angular/router';
import { CalculationsComponent } from './calculations.component';

export default [
    {
        path: '',
        component: CalculationsComponent,
        pathMatch: 'full',
    },
    {
        path: 'job-prices',
        loadChildren: () => import('./job-prices/job-prices-routes'),
    },
    {
        path: 'plate-invoice',
        loadChildren: () => import('./plate-invoice/plate-invoice-routes'),
    },
    {
        path: 'new-invoice',
        loadComponent: () => import('./new-invoice/new-invoice.component').then(c => c.NewInvoiceComponent),
    },
] as Route[];