import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { IControlValueAccessor, IFormBuilder, IFormGroup } from '@rxweb/types';
import { Subscription } from 'rxjs';


@Directive()
export abstract class AbstractPreferencesDirective<T> implements IControlValueAccessor<T>, OnInit, OnDestroy {

    controls: IFormGroup<Partial<T>>;
    protected initialValue: T;

    valueChangeFn: (obj: T) => void;
    touchFn: () => void;

    private _subs = new Subscription();

    constructor(
        ngControl: NgControl,
        protected fb: IFormBuilder,
        protected cd: ChangeDetectorRef,
        protected fm: FocusMonitor,
        protected elRef: ElementRef<HTMLElement>,
    ) {
        ngControl.valueAccessor = this;
    }

    protected abstract writeControl(obj: T): void;

    writeValue(obj: T) {
        this.initialValue = obj;
        this.writeControl(obj);
        this.cd.markForCheck();
    }

    registerOnChange(fn: (obj: T) => void) {
        this.valueChangeFn = fn;
    }

    registerOnTouched(fn: () => void) {
        this.touchFn = fn;
    }

    setDisabledState(disabled: boolean) {
        disabled ? this.controls.disable() : this.controls.enable();
    }

    ngOnInit() {
        this._subs.add(
            this.controls.valueChanges.pipe(
            ).subscribe(val => this.valueChangeFn({ ...this.initialValue, ...val }))
        );
        this.fm.monitor(this.elRef.nativeElement, true).subscribe(origin => {
            if (!origin) { this.touchFn(); }
        });
    }

    ngOnDestroy() {
        this._subs.unsubscribe();
        this.fm.stopMonitoring(this.elRef.nativeElement);
    }


}
