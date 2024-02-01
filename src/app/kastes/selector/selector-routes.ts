import { Route } from '@angular/router';
import { SelectorComponent } from './selector.component';

export default [
  {
    path: ':apjoms',
    component: SelectorComponent,
  },
  {
    path: '',
    redirectTo: '0',
    pathMatch: 'full',
  },
] as Route[];
