import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, Input,
  OnInit, Self, ViewChild
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatSlider, MatSliderChange } from '@angular/material/slider';
import { IControlValueAccessor } from '@rxweb/types';
import { HslColor } from './hsl-color';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorSliderComponent implements OnInit, IControlValueAccessor<string>, AfterViewInit {
  @Input() label = '';

  @ViewChild(MatSlider) private slide: MatSlider;

  onChangeFn: (obj: string) => void;
  onTouchedFn: () => void;

  hslColor = new HslColor();
  disabled = false;

  constructor(
    private cd: ChangeDetectorRef,
    @Self() private ngControl: NgControl
  ) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: string) {
    this.hslColor = HslColor.fromString(obj);
    this.cd.markForCheck();
  }

  registerOnChange(fn: (obj: string) => void) {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouchedFn = fn;
  }

  setDisabledState(state: boolean) {
    this.disabled = state;
    this.cd.markForCheck();
  }

  ngOnInit(): void {
  }

  onSlideChanges(change: MatSliderChange): void {
    this.hslColor.lightness = change.value;
    this.onChangeFn(this.hslColor.toString());
    this.cd.markForCheck();
  }

  ngAfterViewInit() {
    this.slide.onTouched = this.onTouchedFn;
  }

}

