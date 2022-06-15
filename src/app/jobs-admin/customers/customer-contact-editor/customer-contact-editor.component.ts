import { AfterViewInit, Output, Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, UntypedFormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-customer-contact-editor',
  templateUrl: './customer-contact-editor.component.html',
  styleUrls: ['./customer-contact-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CustomerContactEditorComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CustomerContactEditorComponent,
    }
  ]
})
export class CustomerContactEditorComponent<T> implements OnInit, AfterViewInit, ControlValueAccessor, Validator {

  @ViewChild('email') private emailInput: ElementRef<HTMLInputElement>;

  controlGroup = new UntypedFormGroup({
    email: new UntypedFormControl(null, {
      validators: [
        Validators.required, Validators.email,
      ]
    })
  });

  @Output() complete = new Subject<void>();

  private onTouchFn: () => void = () => { };

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.onTouchFn();
    this.emailInput.nativeElement.focus();
  }

  writeValue(obj: T): void {
    this.controlGroup.setValue(obj, { emitEvent: false });
  }

  registerOnChange(fn: (value: T) => void): void {
    this.controlGroup.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.controlGroup.disable();
    } else {
      this.controlGroup.enable();
    }
  }

  validate(): ValidationErrors {
    if (this.controlGroup.valid) {
      return null;
    }
    return this.controlGroup.get('email').errors;
  }

}
