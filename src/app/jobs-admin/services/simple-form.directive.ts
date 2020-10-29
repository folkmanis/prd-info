import { ChangeDetectorRef, Directive, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Subject, merge, BehaviorSubject, Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { FormService } from '../services/form-service';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
/**
 * Pamatklase komponentei ar formu
 */

const ID_FIELD = '_id';

@Directive()
export abstract class SimpleFormDirective<T extends { [ID_FIELD]: any; }> implements OnInit, OnDestroy, CanComponentDeactivate {

  /** Forma */
  get form() { return this.formService.form; }

  /** Sākuma vērtība */
  @Input()
  set initialValue(value: Partial<T>) {
    if (!value) { return; }
    this.formService.initValue(value, { emitEvent: false });
    this._initialValue = value;
  }
  get initialValue(): Partial<T> { return this._initialValue; }
  private _initialValue: Partial<T>;

  constructor(
    protected formService: FormService<T>,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.form.pristine;
  }

  /** Lietojams saglabāšanas pogai. */
  abstract onSave(): void;

  /** Atjauno sākotnējo vērtību */
  onReset() {
    this.formService.initValue(this.initialValue, { emitEvent: false });
  }

}
