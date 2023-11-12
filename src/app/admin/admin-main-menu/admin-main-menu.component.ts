import { Component, inject } from '@angular/core';
import { SystemPreferencesService } from 'src/app/services';
import { AsyncPipe } from '@angular/common';
import { CardMenuComponent } from 'src/app/library/card-menu/card-menu.component';

@Component({
  selector: 'app-admin-main-menu',
  template: `<app-card-menu [modules]="modules$ | async" />`,
  standalone: true,
  imports: [CardMenuComponent, AsyncPipe],
})
export class AdminMainMenuComponent {
  modules$ = inject(SystemPreferencesService).childMenu$;
}
