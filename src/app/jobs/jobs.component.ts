import { Component } from '@angular/core';
import { SystemPreferencesService } from '../services/system-preferences.service';

@Component({
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent {
  modules$ = this.systemPreferencesService.childMenu$;

  constructor(
    private systemPreferencesService: SystemPreferencesService,
  ) { }

}
