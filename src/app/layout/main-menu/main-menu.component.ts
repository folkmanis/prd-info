import { Component, OnInit } from '@angular/core';
import { SystemPreferencesService } from 'src/app/services';
import { AsyncPipe } from '@angular/common';
import { CardMenuComponent } from '../../library/card-menu/card-menu.component';

@Component({
    selector: 'app-main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
    standalone: true,
    imports: [CardMenuComponent, AsyncPipe]
})
export class MainMenuComponent implements OnInit {

  constructor(
    private systemPreferencesService: SystemPreferencesService,
  ) { }

  menuItems$ = this.systemPreferencesService.modules$;

  ngOnInit() {
  }

}
