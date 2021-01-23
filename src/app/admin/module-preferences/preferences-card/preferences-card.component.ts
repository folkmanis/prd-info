import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, OnInit, ContentChild, AfterContentInit, ChangeDetectorRef, ElementRef, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { IControlValueAccessor } from '@rxweb/types';
import { Subscription } from 'rxjs';
import { PreferencesCardControl } from '../preferences-card-control';

@Component({
  selector: 'app-preferences-card',
  templateUrl: './preferences-card.component.html',
  styleUrls: ['./preferences-card.component.scss']
})
export class PreferencesCardComponent<T> implements IControlValueAccessor<T>, OnInit, OnDestroy, AfterContentInit {

  @ContentChild(PreferencesCardControl) private _controler: PreferencesCardControl<T>;

  private initialValue: T;

  valueChangeFn: (obj: T) => void;
  touchFn: () => void;

  private _subs = new Subscription();

  constructor(
    ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef,
    private focusMonitor: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
  ) {
    ngControl.valueAccessor = this;
  }

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
