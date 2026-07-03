import { Component, computed, input, model, ModelSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl } from '@angular/forms/signals';
import { MatSliderModule } from '@angular/material/slider';
import { lightness } from './hsl-color';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss'],
  imports: [MatSliderModule, FormsModule],
})
export class ColorSliderComponent implements FormValueControl<string> {
  value: ModelSignal<string> = model.required();

  touched = model(false);

  disabled = input(false);

  label = input('');

  protected lightness = computed(() => lightness(this.value()));

  onValueChange(value: number) {
    this.value.update((hsl) => hsl.replace(/(\d+(?:\.\d+)?)%(?=\s*\)$)/, `${value}%`));
  }
}
