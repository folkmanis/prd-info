import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { COLORS, Colors, KastesSettings } from 'src/app/kastes/interfaces';
import { ColorSliderComponent } from './color-slider/color-slider.component';

type ColorSettings = KastesSettings['colors'];

type ColorsGroup = {
  [key in keyof ColorSettings]: FormControl<ColorSettings[key]>;
};

@Component({
    selector: 'app-kastes-preferences',
    templateUrl: './kastes-preferences.component.html',
    styleUrls: ['./kastes-preferences.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => KastesPreferencesComponent),
            multi: true,
        },
    ],
    imports: [FormsModule, ReactiveFormsModule, TitleCasePipe, ColorSliderComponent]
})
export class KastesPreferencesComponent implements ControlValueAccessor {
  readonly colors = [...COLORS];

  onTouchFn = () => {};

  preferencesControls = new FormGroup({
    colors: new FormGroup<ColorsGroup>(Object.assign({}, ...COLORS.map((col) => ({ [col]: new FormControl('') })))),
  });

  colorControl(color: Colors): FormControl {
    return this.preferencesControls.controls.colors.controls[color];
  }

  writeValue(obj: any): void {
    this.preferencesControls.patchValue(obj, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.preferencesControls.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.preferencesControls.disable();
    } else {
      this.preferencesControls.enable();
    }
  }
}
