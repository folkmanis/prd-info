import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { map } from 'rxjs';
import { CustomerContact } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';
import { CustomerContactEditorComponent } from './customer-contact-editor/customer-contact-editor.component';

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
    },
  ],
  imports: [ReactiveFormsModule, CustomerContactEditorComponent, MatListModule, MatIcon, MatButtonModule],
})
export class CustomerContactsComponent implements ControlValueAccessor, Validator {
  #fb = inject(FormBuilder);
  #changeDetector = inject(ChangeDetectorRef);
  #customersService = inject(CustomersService);

  contactsArray = this.#fb.array<CustomerContact>([]);

  active: FormControl<CustomerContact | null> | null = null;

  #onTouchFn: () => void = () => {};

  writeValue(obj: CustomerContact[]): void {
    obj = obj instanceof Array ? obj : [];
    this.setControlsArray(obj);
    this.contactsArray.setValue(obj, { emitEvent: false });
  }

  registerOnChange(fn: (val: CustomerContact[]) => void): void {
    this.contactsArray.valueChanges.pipe(map((value) => value)).subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.#onTouchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.contactsArray.disable({ emitEvent: false });
    } else {
      this.contactsArray.enable({ emitEvent: false });
    }
  }

  validate(): ValidationErrors | null {
    if (this.contactsArray.valid) {
      return null;
    } else {
      return this.contactsArray.controls.reduce((acc, curr) => ({ ...acc, ...curr.errors }), {});
    }
  }

  onTouch() {
    this.#onTouchFn();
  }

  addContact() {
    const newContact = this.#fb.control(this.#customersService.newCustomerContact(''));
    this.contactsArray.push(newContact, { emitEvent: false });
    newContact.setErrors({ required: true }, { emitEvent: false });
    this.active = newContact;
  }

  onFinishEditing(idx: number) {
    this.active = null;
    if (!this.contactsArray.at(idx).value?.email) {
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

    this.#changeDetector.markForCheck();
  }
}
