import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { PreferencesComponent } from './preferences-component.class';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-module-preferences',
  templateUrl: './module-preferences.component.html',
  styleUrls: ['./module-preferences.component.css']
})
export class ModulePreferencesComponent implements OnInit, CanComponentDeactivate {
  @ViewChild('kastes', { static: false }) private kastes: PreferencesComponent;

  constructor(
  ) { }

  ngOnInit() {
  }

  canDeactivate(): boolean | Observable<boolean> {
    return zip(this.kastes.canDeactivate())
      .pipe(
        map(result => result.reduce((acc, curr) => acc && curr, true))
      );
  }

  onSaveAll() {
    this.kastes.onSave();
  }

  onResetAll() {
    this.kastes.onReset();
  }

}
