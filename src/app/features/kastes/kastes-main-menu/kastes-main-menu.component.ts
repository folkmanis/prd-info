import { Component } from '@angular/core';
import { LoginService } from '../../../login/login.service';
import { Store } from '@ngrx/store';
import { StoreState } from 'src/app/interfaces';
import { childMenu } from 'src/app/selectors';

@Component({
  selector: 'app-kastes-main-menu',
  template: `<app-card-menu [modules]='modules$ | async'></app-card-menu>`,
})
export class KastesMainMenuComponent {

  constructor(
    private store: Store<StoreState>,
  ) { }

  modules$ = this.store.select(childMenu, {module: 'kastes'});


}
