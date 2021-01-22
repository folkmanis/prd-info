import { Component, OnInit, Self } from '@angular/core';
import { FormBuilder, NgControl } from '@angular/forms';
import { IControlValueAccessor, IFormBuilder, IFormGroup } from '@rxweb/types';
import { SystemSettings } from 'src/app/interfaces';

type SystemSettingsPartial = Partial<SystemSettings>;

@Component({
  selector: 'app-system-preferences',
  templateUrl: './system-preferences.component.html',
  styleUrls: ['./system-preferences.component.scss']
})
export class SystemPreferencesComponent implements OnInit, IControlValueAccessor<SystemSettingsPartial> {

  fb: IFormBuilder;
  settingsForm: IFormGroup<SystemSettingsPartial>;

  constructor(
    fb: FormBuilder,
    @Self() private ngControl: NgControl
  ) {
    this.fb = fb;
    this.settingsForm = this.fb.group<SystemSettingsPartial>({
      menuExpandedByDefault: [true],
    });
    this.ngControl.valueAccessor = this;
  }

  onChangeFn: (val: SystemSettingsPartial) => void;
  onTouchedFn: () => void;

  writeValue(obj: SystemSettings) {
    this.settingsForm.patchValue(obj);
  }

  registerOnChange(fn: any) {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.settingsForm.disable();
    } else {
      this.settingsForm.enable();
    }
  }

  ngOnInit() {
    this.settingsForm.valueChanges.subscribe(this.onChangeFn);
  }

}
