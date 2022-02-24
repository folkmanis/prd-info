import { FocusMonitor } from '@angular/cdk/a11y';
import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PreferencesCardControl } from '../preferences-card-control';

@Component({
  selector: 'app-preferences-card',
  templateUrl: './preferences-card.component.html',
  styleUrls: ['./preferences-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PreferencesCardComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: PreferencesCardComponent,
      multi: true,
    }
  ]
})
export class PreferencesCardComponent<T> implements ControlValueAccessor, Validator, OnInit, OnDestroy, AfterContentInit {

  @ContentChild(PreferencesCardControl) private _controler: PreferencesCardControl<T>;

  private initialValue: T;

  valueChangeFn: (obj: T) => void;
  touchFn: () => void;

  private _subs = new Subscription();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private focusMonitor: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
  ) { }

  writeValue(obj: T) {
    this.initialValue = obj;
    if (this._controler) {
      this._controler.value = obj;
    }
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: (obj: T) => void) {
    this.valueChangeFn = fn;
  }

  registerOnTouched(fn: () => void) {
    this.touchFn = fn;
  }

  setDisabledState(disabled: boolean) {
    if (!this._controler) { return; }
    disabled ? this._controler.controls.disable() : this._controler.controls.enable();
  }

  ngOnInit() {
    this.focusMonitor.monitor(this.elRef.nativeElement, true).subscribe(origin => {
      if (!origin) { this.touchFn(); }
    });
  }

  validate(): ValidationErrors {
    if (!this._controler) return null;
    const component = Object.getPrototypeOf(this._controler).constructor.name;
    return this._controler?.controls.valid ? null : { component };
  }

  ngAfterContentInit(): void {
    this._validateControler();
    this._controler.value = this.initialValue;
    this._controler.stateChanges.subscribe(_ => this.changeDetectorRef.markForCheck());
    this._subs.add(
      this._controler.controls.valueChanges.pipe(
      ).subscribe(val => this.valueChangeFn({ ...this.initialValue, ...val }))
    );
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
    this.focusMonitor.stopMonitoring(this.elRef.nativeElement);
  }

  private _validateControler(): void | never {
    if (!this._controler || !this._controler.controls || !this._controler.stateChanges) {
      throw new Error('Card contents component not found');
    }
  }


}
