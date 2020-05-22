import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription, Observable, of } from 'rxjs';
import { PreferencesComponent } from '../preferences-component.class';
import { ModulePreferencesService } from '../../services/module-preferences.service';
import { SystemSettings } from 'src/app/interfaces';
import { tap, pluck, map } from 'rxjs/operators';

@Component({
  selector: 'app-system-preferences',
  templateUrl: './system-preferences.component.html',
  styleUrls: ['./system-preferences.component.css', '../module-preferences.component.css']
})
export class SystemPreferencesComponent implements OnInit, PreferencesComponent, OnDestroy {

  constructor(
    private fb: FormBuilder,
    private preferencesService: ModulePreferencesService,
  ) { }

  sysPref$: Observable<SystemSettings> = this.preferencesService.getModulePreferences<SystemSettings>('system');
  defaults: Partial<SystemSettings>;
  settingsForm: FormGroup = this.fb.group({
    menuExpandedByDefault: []
  });
  private readonly subs = new Subscription();


  ngOnInit() {
    const _subs = this.sysPref$.pipe(
      map(({ menuExpandedByDefault }) => ({ menuExpandedByDefault })),
      tap(pref => {
        this.settingsForm.patchValue(pref, { emitEvent: false });
        this.defaults = pref;
        this.settingsForm.markAsPristine();
      })
    ).subscribe();
    this.subs.add(_subs);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  canDeactivate(): Observable<boolean> {
    return of(this.settingsForm.pristine);
  }

  onSave() {
    this.preferencesService.updateModulePreferences('system', this.settingsForm.value);
  }

  onReset() {
    this.settingsForm.reset(this.defaults);
  }

}
