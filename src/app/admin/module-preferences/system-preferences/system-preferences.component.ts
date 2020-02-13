import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { PreferencesComponent } from '../preferences-component.class';
import { ModulePreferencesService, SystemSettings } from '../../services/module-preferences.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-system-preferences',
  templateUrl: './system-preferences.component.html',
  styleUrls: ['./system-preferences.component.css', '../module-preferences.component.css']
})
export class SystemPreferencesComponent implements OnInit, PreferencesComponent {

  constructor(
    private fb: FormBuilder,
    private preferencesService: ModulePreferencesService,
  ) { }

  sysPref$: Observable<SystemSettings> = this.preferencesService.getModulePreferences<SystemSettings>('system');
  settingsForm: FormGroup;
  defaults: SystemSettings;


  ngOnInit() {
    this.sysPref$.pipe(
      tap(pref => {
        this.defaults = pref;
        this.settingsForm = this.fb.group(pref);
      })
    )
      .subscribe();
  }

  canDeactivate(): Observable<boolean> {
    return of(this.settingsForm.pristine);
  }

  onSave() {
    this.preferencesService.updateModulePreferences('system', this.settingsForm.value)
      .subscribe(result => {
        if (result) {
          this.defaults = this.settingsForm.value;
          this.settingsForm.markAsPristine();
        }
      });
  }

  onReset() {
    this.settingsForm.reset(this.defaults);
  }

}