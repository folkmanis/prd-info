import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ElementRef, Self } from '@angular/core';
import { FormBuilder, NgControl } from '@angular/forms';
import { SystemSettings } from 'src/app/interfaces';
import { AbstractPreferencesDirective } from '../abstract-preferences.directive';

type SystemSettingsPartial = Partial<SystemSettings>;

@Component({
  selector: 'app-system-preferences',
  templateUrl: './system-preferences.component.html',
  styleUrls: ['./system-preferences.component.scss']
})
export class SystemPreferencesComponent extends AbstractPreferencesDirective<SystemSettings>  {

  constructor(
    cd: ChangeDetectorRef,
    fb: FormBuilder,
    @Self() ngControl: NgControl,
    fm: FocusMonitor,
    elRef: ElementRef<HTMLElement>,
  ) {
    super(ngControl, fb, cd, fm, elRef);
    this.controls = this.fb.group<SystemSettingsPartial>({
      menuExpandedByDefault: [true],
    });
  }

  protected writeControl(obj: SystemSettings) {
    this.controls.patchValue(obj);
  }


}
