import { Component, OnInit } from '@angular/core';
import { SystemPreferencesService } from '../services/system-preferences.service';

@Component({
  selector: 'app-calculations',
  templateUrl: './calculations.component.html',
  styleUrls: ['./calculations.component.scss']
})
export class CalculationsComponent implements OnInit {

  modules$ = this.systemPreferencesService.childMenu$;

  constructor(
    private systemPreferencesService: SystemPreferencesService,
  ) { }

  ngOnInit(): void {
  }

}
