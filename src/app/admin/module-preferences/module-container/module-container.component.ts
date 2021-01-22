import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { NgControl } from '@angular/forms';
import { IControlValueAccessor, IFormBuilder, IFormGroup } from '@rxweb/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-module-container',
  templateUrl: './module-container.component.html',
  styleUrls: ['./module-container.component.scss']
})
export class ModuleContainerComponent<T> implements IControlValueAccessor<T>, OnInit, OnDestroy {

  @Input() set controls(controls: IFormGroup<Partial<T>>) {
    this._subs.unsubscribe();
    if (!controls) { return; }
    this._subs.add(
      this.controls.valueChanges.pipe(
      ).subscribe(val => this.valueChangeFn({ ...this.initialValue, ...val }))
    );
  }

  @Output() write = new EventEmitter<T>();

  private initialValue: T;

  valueChangeFn: (obj: T) => void;
  touchFn: () => void;

  private _subs = new Subscription();

  constructor(
    ngControl: NgControl,
    private cd: ChangeDetectorRef,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
  ) {
    ngControl.valueAccessor = this;
  }

  writeValue(obj: T) {
    this.initialValue = obj;
    this.write.next(obj);
    this.cd.markForCheck();
  }

  registerOnChange(fn: (obj: T) => void) {
    this.valueChangeFn = fn;
  }

  registerOnTouched(fn: () => void) {
    this.touchFn = fn;
  }

  setDisabledState(disabled: boolean) {
    if (!this.controls) { return; }
    disabled ? this.controls.disable() : this.controls.enable();
  }

  ngOnInit() {
    this.fm.monitor(this.elRef.nativeElement, true).subscribe(origin => {
      if (!origin) { this.touchFn(); }
    });
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
    this.fm.stopMonitoring(this.elRef.nativeElement);
    this.write.complete();
  }


}
