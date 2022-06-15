import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { NgControl, Validators, UntypedFormBuilder } from '@angular/forms';
import { IFormBuilder, IControlValueAccessor, IFormGroup } from '@rxweb/types';
import { PaytraqSettings, PaytraqConnectionParams } from 'src/app/interfaces';
import { Subscription } from 'rxjs';

const DEFAULT_VALUE: PaytraqConnectionParams = {
  connectUrl: null,
  connectKey: null,
  apiUrl: null,
  apiKey: null,
  apiToken: null,
  invoiceUrl: null,
};

@Component({
  selector: 'app-paytraq-connection-params',
  templateUrl: './paytraq-connection-params.component.html',
  styleUrls: ['./paytraq-connection-params.component.scss']
})
export class PaytraqConnectionParamsComponent implements OnInit, OnDestroy, IControlValueAccessor<PaytraqConnectionParams> {

  private fb: IFormBuilder;
  controls: IFormGroup<PaytraqConnectionParams>;

  private onChange: (obj: PaytraqConnectionParams) => void;
  private onTouched: () => void;

  private readonly _subs = new Subscription();

  constructor(
    private ngControl: NgControl,
    fb: UntypedFormBuilder,
  ) {
    this.ngControl.valueAccessor = this;
    this.fb = fb;
    this.controls = this.fb.group<PaytraqConnectionParams>({
      connectUrl: [undefined],
      connectKey: [undefined],
      apiUrl: [undefined],
      apiKey: [undefined],
      apiToken: [undefined],
      invoiceUrl: [undefined],
    });
  }

  writeValue(obj: PaytraqConnectionParams) {
    this.controls.setValue({ ...DEFAULT_VALUE, ...obj });
  }

  registerOnChange(fn: (obj: PaytraqConnectionParams) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.controls.disable();
    } else {
      this.controls.enable();
    }
  }

  ngOnInit(): void {
    this._subs.add(
      this.controls.valueChanges.subscribe(this.onChange)
    );
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }


}
