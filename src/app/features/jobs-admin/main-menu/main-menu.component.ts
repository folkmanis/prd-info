import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreState } from 'src/app/interfaces';
import { childMenu } from 'src/app/selectors';

@Component({
  template: `<app-card-menu [modules]='modules$ | async'></app-card-menu>`,
})
export class MainMenuComponent {

  constructor(
    private store: Store<StoreState>,
  ) { }
  modules$ = this.store.select(childMenu, {module: 'jobs-admin'});

}
