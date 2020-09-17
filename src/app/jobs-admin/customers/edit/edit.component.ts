import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { map, filter, tap, switchMap, debounceTime, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { isEqual, defaults, clone } from 'lodash';
import { Customer } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { IFormGroup, IFormBuilder } from '@rxweb/types';
import { DestroyService } from 'src/app/library/rx/destroy.service';

const CUSTOMER_DEFAULTS: Customer = {
  _id: '',
  CustomerName: '',
  code: '',
  disabled: false,
  description: '',
};

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [DestroyService],
})
export class EditComponent implements OnInit, CanComponentDeactivate {

  private fb: IFormBuilder;
  customerForm: IFormGroup<Customer>;

  constructor(
    private route: ActivatedRoute,
    fb: FormBuilder,
    private service: CustomersService,
    private dialog: ConfirmationDialogService,
    private destroy$: DestroyService,
  ) {
    this.fb = fb;
  }

  customer$: Observable<Customer>;
  private customer: Customer;
  get code(): AbstractControl { return this.customerForm.get('code'); }

  ngOnInit(): void {
    this.customerForm = this.fb.group<Customer>({
      _id: [''],
      CustomerName: [''],
      code: [
        '', {
          validators: [Validators.required, Validators.minLength(2), Validators.maxLength(3)],
          asyncValidators: this.validateCode('code')
        }
      ],
      disabled: [false],
      description: [''],
      financial: this.fb.group({
        clientName: [undefined],
      })
    });

    this.customer$ = this.route.paramMap.pipe(
      map(paramMap => paramMap.get('id')),
      filter(id => !!id),
      switchMap(id => this.service.getCustomer(id)),
      tap(cust => this.customer = clone(cust)),
      tap(this.updateForm(this.customerForm)),
    );
    this.customerForm.valueChanges.pipe(
      tap(val => isEqual(this.customer, val) && this.customerForm.markAsPristine()),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  onSave() {
    const code = (this.code.value as string).toUpperCase();
    this.code.setValue(code, { emitevent: false });
    this.service.updateCustomer(this.customerForm.value).pipe(
      tap(() => this.customerForm.markAsPristine()),
      tap(() => this.customer = this.customerForm.value)
    ).subscribe();
  }

  onRestore(id: string) {
    this.dialog.confirm('Atcelt izmaiņas').pipe(
      switchMap(() => this.service.getCustomer(id)),
      tap(this.updateForm(this.customerForm))
    ).subscribe();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.customerForm.pristine) {
      return true;
    }
    return this.dialog.discardChanges();
  }

  private updateForm(form: IFormGroup<Customer>): (cust: Customer) => void {
    return (cust: Customer): void => {
      if (!cust) { return; }

      form.reset(undefined, { emitEvent: false });
      form.patchValue(defaults(cust, CUSTOMER_DEFAULTS), { emitEvent: false });
    };
  }

  private validateCode(field: keyof Customer): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any; } | null> => {
      return this.customer?.code === control.value ? of(null) : this.service.validator(field, control.value).pipe(
        map(val => val ? null : { occupied: control.value })
      );
    };
  }

}
