import { FocusMonitor } from '@angular/cdk/a11y';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PaytraqConnectionParams } from 'src/app/interfaces';

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
  styleUrls: ['./paytraq-connection-params.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PaytraqConnectionParamsComponent,
      multi: true,
    }
  ]
})
export class PaytraqConnectionParamsComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {

  @ViewChild('container') private containerEl: HTMLDivElement;

  controls = this.fb.group<PaytraqConnectionParams>({
    connectUrl: undefined,
    connectKey: undefined,
    apiUrl: undefined,
    apiKey: undefined,
    apiToken: undefined,
    invoiceUrl: undefined,
  });


  private onTouched: () => void = () => { };

  constructor(
    private fb: FormBuilder,
    private focusMonitor: FocusMonitor,
  ) { }

  writeValue(obj: PaytraqConnectionParams) {
    this.controls.setValue({ ...DEFAULT_VALUE, ...obj }, { emitEvent: false });
  }

  registerOnChange(fn: (obj: PaytraqConnectionParams) => void) {
    this.controls.valueChanges.subscribe(fn);
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
  }

  ngAfterViewInit(): void {
    this.focusMonitor.monitor(this.containerEl, true).subscribe(this.onTouched);
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.containerEl);
  }


}
