import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { PreferencesComponent } from '../preferences-component.class';
import { SystemSettings } from 'src/app/interfaces';
import { tap, pluck, map, take } from 'rxjs/operators';
import { SystemPreferencesService } from 'src/app/services';

@Component({
  selector: 'app-system-preferences',
  templateUrl: './system-preferences.component.html',
  styleUrls: ['./system-preferences.component.scss']
})
export class SystemPreferencesComponent implements OnInit, PreferencesComponent {

  constructor(
    private fb: FormBuilder,
    private systemPreferencesService: SystemPreferencesService,
  ) { }

  sysPref$: Observable<SystemSettings> = this.systemPreferencesService.getModulePreferences<SystemSettings>('system');
  settingsForm: FormGroup = this.fb.group({
    menuExpandedByDefault: [true],
  });
  defaults: Partial<SystemSettings>;


  ngOnInit() {
    this.sysPref$.pipe(
      take(1),
      tap(this.setForm)
    )
      .subscribe();
  }

  canDeactivate(): Observable<boolean> {
    return of(this.settingsForm.pristine);
  }

  onSave = () => {
    this.systemPreferencesService.updateModulePreferences('system', this.settingsForm.value)
      .subscribe(() => this.settingsForm.markAsPristine());
  }

  onReset = () => this.sysPref$.pipe(take(1), tap(this.setForm)).subscribe();

  private setForm = (sett: SystemSettings) => this.settingsForm.reset(sett, { emitEvent: false });

}
