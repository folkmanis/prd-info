import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { COLORS, KastesSettings } from 'src/app/kastes/interfaces';
import { ColorSliderComponent } from '../color-slider/color-slider.component';

type ColorSettings = KastesSettings['colors'];

type ColorsGroup = {
  [key in keyof ColorSettings]: FormControl<ColorSettings[key]>;
};

@Component({
  selector: 'app-kastes-colors',
  templateUrl: './kastes-colors.component.html',
  styleUrls: ['./kastes-colors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: KastesColorsComponent,
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    ColorSliderComponent,
    FormsModule,
    ReactiveFormsModule,
    TitleCasePipe,
  ],
})
export class KastesColorsComponent implements ControlValueAccessor {
  readonly colors = [...COLORS];

  colorGroup = new FormGroup<ColorsGroup>(
    Object.assign({}, ...COLORS.map((col) => ({ [col]: new FormControl('') })))
  );

  onTouchFn: () => void = () => {};

  writeValue(obj: ColorSettings): void {
    this.colorGroup.setValue(obj, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.colorGroup.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.colorGroup.disable();
    } else {
      this.colorGroup.enable();
    }
  }
}
