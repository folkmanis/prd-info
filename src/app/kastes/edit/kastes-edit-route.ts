import { Route } from '@angular/router';
import { PasutijumiTabulaComponent } from './pasutijumi-tabula/pasutijumi-tabula.component';
import { PasutijumsEditComponent } from './pasutijums-edit/pasutijums-edit.component';
import { resolveKastesJob } from './services/kastes-job-resolver';

export default [
    {
        path: '',
        component: PasutijumiTabulaComponent,
        children: [
            {
                path: ':id',
                component: PasutijumsEditComponent,
                resolve: {
                    kastesJob: resolveKastesJob
                }
            }
        ]
    }
] as Route[];