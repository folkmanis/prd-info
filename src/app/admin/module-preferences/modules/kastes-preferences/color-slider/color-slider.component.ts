import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, forwardRef, input, model, output, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { hslToString, stringToHsl } from './hsl-color';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorSliderComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [MatSliderModule, FormsModule],
})
export class ColorSliderComponent implements ControlValueAccessor {
  private slider = viewChild(MatSlider, { read: ElementRef });
  private onChangeFn: (obj: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  private hue = signal(0);
  private saturation = signal(0);

  label = input('');

  disabled = signal(false);

  lightness = model(0);

  displayColor = computed(() => hslToString(this.hue(), this.saturation(), this.lightness()));

  focus = output<void>();

  constructor(focusMonitor: FocusMonitor) {
    effect((onCleanup) => {
      const element = this.slider().nativeElement;
      focusMonitor.monitor(element, true).subscribe(() => {
        this.onTouchedFn();
        this.focus.emit();
      });
      onCleanup(() => {
        focusMonitor.stopMonitoring(element);
      });
    });
  }

  writeValue(obj: string) {
    const hsl = stringToHsl(obj);
    if (hsl) {
      this.hue.set(hsl.hue);
      this.saturation.set(hsl.saturation);
      this.lightness.set(hsl.lightness);
    }
  }

  registerOnChange(onChangeFn: (obj: string) => void) {
    this.onChangeFn = onChangeFn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouchedFn = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled.set(disabled);
  }

  onValueChange() {
    this.onChangeFn(this.displayColor());
  }
}
