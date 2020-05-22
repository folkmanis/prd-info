import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreState } from 'src/app/interfaces';
import { getMenuModules } from 'src/app/selectors';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(
    private store: Store<StoreState>,
  ) { }

  menuItems$ = this.store.select(getMenuModules);

  ngOnInit() {
  }

}
