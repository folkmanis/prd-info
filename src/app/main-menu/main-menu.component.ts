import { Component, OnInit } from '@angular/core';
import { SystemPreferencesService } from '../services';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(
    private systemPreferencesService: SystemPreferencesService,
  ) { }

  menuItems$ = this.systemPreferencesService.modules$;

  ngOnInit() {
  }

}
