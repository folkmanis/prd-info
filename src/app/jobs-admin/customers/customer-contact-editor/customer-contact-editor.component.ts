import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
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
    }
  ]
})
export class CustomerContactEditorComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator {

  @ViewChild('email') private emailInput: ElementRef<HTMLInputElement>;

  controlGroup = new FormGroup({
    email: new FormControl<string>(null, {
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

  writeValue(obj: CustomerContact): void {
    this.controlGroup.setValue(obj, { emitEvent: false });
  }

  registerOnChange(fn: (value: CustomerContact) => void): void {
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
