import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { HslColor } from './hsl-color';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ColorSliderComponent,
      multi: true,
    }
  ]
})
export class ColorSliderComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {

  @Input() label = '';

  @ViewChild(MatSlider, { read: ElementRef }) private slide: ElementRef;

  onChangeFn: (obj: string) => void;
  onTouchedFn: () => void;

  hslColor = new HslColor();

  colorForm = new FormControl<number>(0);

  constructor(
    private cd: ChangeDetectorRef,
    private focusMonitor: FocusMonitor,
  ) { }

  writeValue(obj: string) {
    this.hslColor = HslColor.fromString(obj);
    this.colorForm.setValue(this.hslColor.lightness);
    this.cd.markForCheck();
  }

  registerOnChange(fn: (obj: string) => void) {
    this.colorForm.valueChanges.subscribe(value => {
      this.hslColor.lightness = value;
      fn(this.hslColor.toString());
      this.cd.markForCheck();
    });
  }

  registerOnTouched(fn: () => void) {
    this.onTouchedFn = fn;
  }

  setDisabledState(disabled: boolean) {
    if (disabled) {
      this.colorForm.disable();
    } else {
      this.colorForm.enable();
    }
    this.cd.markForCheck();
  }

  ngAfterViewInit() {
    this.focusMonitor.monitor(this.slide.nativeElement, true).subscribe(this.onTouchedFn);
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.slide.nativeElement);
  }

}

