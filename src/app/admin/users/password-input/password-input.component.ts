import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy, HostBinding, Optional, Self, ElementRef, Inject } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, ValidationErrors, NgControl, ControlValueAccessor } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { takeUntil } from 'rxjs/operators';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams } from 'src/app/interfaces';
import { DestroyService } from 'src/app/library/rx/destroy.service';

interface Pwd {
  password1: string;
  password2: string;
}

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DestroyService,
  ]
})
export class PasswordInputComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input()
  get value(): string {
    return this.passwordForm.valid ? this.passwordForm.value.password1 : undefined;
  }
  set value(pwd: string) {
    pwd = pwd || '';
    this.passwordForm.setValue({
      password1: pwd,
      password2: pwd,
    });
  }

  private fb: IFormBuilder;
  passwordForm: IFormGroup<Pwd>;
  hide = true;

  constructor(
    fb: FormBuilder,
    @Optional() @Self() public ngControl: NgControl,
    private destroy$: DestroyService,
  ) {
    this.fb = fb;
    this.passwordForm = this.fb.group<Pwd>({
      password1: [undefined],
      password2: [undefined],
    }, {
      validators: [this.notEqual]
    });

    if (this.ngControl) { ngControl.valueAccessor = this; }
  }


  private onChanges: (val: string) => void;
  private onTouched: () => void;

  writeValue(val: any) {
    this.value = typeof val === 'string' ? val : '';
  }

  registerOnChange(fn: (val: string) => void) {
    this.onChanges = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.passwordForm.disable() : this.passwordForm.enable();
  }

  ngOnInit(): void {
    this.passwordForm.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(val => {
      this.onChanges(this.passwordForm.valid ? val.password1 : undefined);
      this.onTouched();
    });
  }

  ngOnDestroy(): void {
  }

  private notEqual(control: IFormGroup<Pwd>): ValidationErrors | null {
    const isEqual = control.value.password1 === control.value.password2;
    const error = !isEqual ? { notEqual: 'Parolēm jāsakrīt' } : null;
    control.controls.password2.setErrors(error);
    return error;
  }


}
