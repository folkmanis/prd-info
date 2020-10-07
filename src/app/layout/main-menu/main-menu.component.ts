import { Component, OnInit } from '@angular/core';
import { SystemPreferencesService } from 'src/app/services';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  constructor(
    private systemPreferencesService: SystemPreferencesService,
  ) { }

  menuItems$ = this.systemPreferencesService.modules$;

  ngOnInit() {
  }

}
