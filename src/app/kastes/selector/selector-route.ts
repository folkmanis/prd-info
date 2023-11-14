import { Route } from '@angular/router';
import { SelectorComponent } from './selector.component';

export default [
  {
    path: 'selector/:apjoms',
    component: SelectorComponent,
  },
  {
    path: 'selector',
    redirectTo: 'selector/0',
  },
] as Route[];
