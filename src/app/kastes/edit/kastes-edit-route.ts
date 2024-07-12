import { Route } from '@angular/router';
import { PasutijumiTabulaComponent } from './pasutijumi-tabula/pasutijumi-tabula.component';
import { PasutijumsEditComponent } from './pasutijums-edit/pasutijums-edit.component';

export default [
  {
    path: '',
    component: PasutijumiTabulaComponent,
    children: [
      {
        path: ':jobId',
        component: PasutijumsEditComponent,
      },
    ],
  },
] as Route[];
