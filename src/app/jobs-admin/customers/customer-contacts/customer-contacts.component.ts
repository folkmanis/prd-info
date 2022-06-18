import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  ControlValueAccessor, FormBuilder, FormControl,
  NG_VALIDATORS, NG_VALUE_ACCESSOR,
  ValidationErrors, Validator
} from '@angular/forms';
import { CustomerContact } from 'src/app/interfaces';

const DEFAULT_CONTACT: CustomerContact = {
  email: '',
};

@Component({
  selector: 'app-customer-contacts',
  templateUrl: './customer-contacts.component.html',
  styleUrls: ['./customer-contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CustomerContactsComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CustomerContactsComponent,
    }
  ]
})
export class CustomerContactsComponent implements OnInit, ControlValueAccessor, Validator {

  controlGroup = this.fb.group({
    contacts: this.fb.array<CustomerContact>([])
  });

  get contactsArray() {
    return this.controlGroup.controls.contacts;
  }

  active: FormControl<CustomerContact> | null = null;

  private onTouchFn: () => void = () => { };

  constructor(
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  writeValue(obj: CustomerContact[]): void {
    obj = obj instanceof Array ? obj : [];
    this.setControlsArray(obj);
    this.contactsArray.setValue(obj, { emitEvent: true });
  }

  registerOnChange(fn: (val: CustomerContact[]) => void): void {
    this.contactsArray.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
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
    if (this.contactsArray.valid) {
      return null;
    } else {
      return this.contactsArray.controls.reduce((acc, curr) => ({ ...acc, ...curr.errors }), {});
    }
  }

  onTouch() {
    this.onTouchFn();
  }

  addContact() {
    const newContact = this.fb.control(DEFAULT_CONTACT);
    this.contactsArray.push(
      newContact,
      { emitEvent: false }
    );
    newContact.setErrors({ required: true }, { emitEvent: false });
    this.active = newContact;
  }

  onFinishEditing(idx: number) {
    this.active = null;
    if (!this.contactsArray.at(idx).value.email) {
      this.contactsArray.removeAt(idx);
    }
  }

  private setControlsArray<T>(value: T[]) {

    if (value.length === this.contactsArray.length) {
      return;
    }
    this.contactsArray.clear({ emitEvent: false });
    for (let idx = 0; idx < value.length; idx++) {
      this.contactsArray.push(new FormControl(), { emitEvent: false });
    }

    this.changeDetector.markForCheck();
  }

}
