import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { NgControl, FormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup, IControlValueAccessor } from '@rxweb/types';
import { SystemPreferencesService } from 'src/app/services';
import { Customer, CustomerFinancial } from 'src/app/interfaces';
import { DestroyService } from 'src/app/library/rx';
import { takeUntil } from 'rxjs/operators';

const DEFAULT_VALUE: CustomerFinancial = {
  clientName: '',
  paytraqId: undefined,
};

@Component({
  selector: 'app-paytraq-customer',
  templateUrl: './paytraq-customer.component.html',
  styleUrls: ['./paytraq-customer.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaytraqCustomerComponent implements OnInit, IControlValueAccessor<CustomerFinancial> {

  private fb: IFormBuilder;

  private preferences$ = this.systemPreferencesService.preferences$;

  private onChanges: (obj: CustomerFinancial) => void;
  private onTouched: () => void;

  control: IFormGroup<CustomerFinancial>;

  constructor(
    fb: FormBuilder,
    private ngControl: NgControl,
    private systemPreferencesService: SystemPreferencesService,
    private destroy$: DestroyService,
  ) {
    this.fb = fb;
    this.control = this.fb.group<CustomerFinancial>({
      clientName: [undefined],
      paytraqId: [undefined],
    });
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: CustomerFinancial) {
    console.log(obj);
    this.control.patchValue({ ...DEFAULT_VALUE, ...obj });
  }

  registerOnChange(fn: (obj: CustomerFinancial) => void) {
    this.onChanges = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  ngOnInit(): void {
    this.control.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      value => this.onChanges(value)
    );
  }

}
