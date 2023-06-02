import { Route } from '@angular/router';
import { JobsComponent } from './jobs.component';


export default [
    {
        path: 'repro',
        loadChildren: () => import('./repro-jobs/repro-jobs-routes'),
    },
    {
        path: 'products-production',
        loadComponent: () => import('./products-production/products-production.component').then(c => c.ProductsProductionComponent)
    },
    {
        path: 'gmail',
        loadChildren: () => import('./gmail/gmail-routes')
    },
    {
        path: '',
        component: JobsComponent,
    },

] as Route[];