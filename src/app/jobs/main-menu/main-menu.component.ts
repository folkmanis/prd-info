import { Component } from '@angular/core';
import { SystemPreferencesService } from 'src/app/services';
import { LayoutService } from 'src/app/layout/layout.service';

@Component({
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent {

  constructor(
    private systemPreferencesService: SystemPreferencesService,
    private layoutService: LayoutService,
  ) { }
  isSmall$ = this.layoutService.isSmall$;
  isLarge$ = this.layoutService.isLarge$;
  modules$ = this.systemPreferencesService.childMenu$;

}
