import { Component } from '@angular/core';
import { LoginService } from 'src/app/login/login.service';
import { Store } from '@ngrx/store';
import { StoreState } from 'src/app/interfaces';
import { childMenu } from 'src/app/selectors';

@Component({
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css'],
})
export class MainMenuComponent {

  constructor(
    private store: Store<StoreState>,
  ) { }
  modules$ = this.store.select(childMenu, {module: 'jobs'});

}
