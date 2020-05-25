import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreState } from 'src/app/interfaces';
import { childMenu } from 'src/app/store/selectors/system.selectors';

@Component({
  selector: 'app-admin-main-menu',
  template: `<app-card-menu [modules]="modules$ | async"></app-card-menu>`,
})
export class AdminMainMenuComponent {

  constructor(
    private store: Store<StoreState>,
  ) { }
  modules$ = this.store.select(childMenu, {module: 'admin'});

}
