import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, inject, output, viewChild } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { CustomerContact } from 'src/app/interfaces';

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
        },
    ],
    imports: [ReactiveFormsModule]
})
export class CustomerContactEditorComponent implements ControlValueAccessor, Validator {
  private emailInput = viewChild.required<ElementRef<HTMLInputElement>>('email');

  emailControl = inject(FormBuilder).control(null as string | null, {
    validators: [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)],
  });

  complete = output<void>();

  private onTouchFn: () => void = () => {};

  constructor() {
    afterNextRender({
      write: () => {
        this.emailInput().nativeElement.focus();
        this.onTouchFn();
      },
    });
  }

  writeValue(obj: CustomerContact | null): void {
    this.emailControl.setValue(obj?.email, { emitEvent: false });
  }

  registerOnChange(fn: (value: CustomerContact) => void): void {
    this.emailControl.valueChanges.pipe(map((value) => (value ? new CustomerContact(value) : null))).subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.emailControl.disable({ emitEvent: false });
    } else {
      this.emailControl.enable({ emitEvent: false });
    }
  }

  validate(): ValidationErrors {
    if (this.emailControl.valid) {
      return null;
    }
    return this.emailControl.errors;
  }
}
