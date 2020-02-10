import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { KastesPreferencesComponent } from './kastes-preferences/kastes-preferences.component';

@Component({
  selector: 'app-module-preferences',
  templateUrl: './module-preferences.component.html',
  styleUrls: ['./module-preferences.component.css']
})
export class ModulePreferencesComponent implements OnInit, CanComponentDeactivate {
  @ViewChild('kastes', { static: false }) private kastes: KastesPreferencesComponent;

  constructor() { }

  ngOnInit() {
  }

  canDeactivate(): boolean | Observable<boolean> {
    return this.kastes.canDeactivate();
  }

}
