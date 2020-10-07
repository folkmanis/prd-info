import { Component, OnInit } from '@angular/core';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { Observable, of } from 'rxjs';
import { FormGroup, FormBuilder, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomersService } from 'src/app/services';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { map, tap, filter } from 'rxjs/operators';
import { Customer, NewCustomer } from 'src/app/interfaces';
import { IFormGroup, IFormBuilder, IFormControl } from '@rxweb/types';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, CanComponentDeactivate {

  private fb: IFormBuilder;
  customerForm: IFormGroup<NewCustomer>;

  constructor(
    fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: CustomersService,
    private dialog: ConfirmationDialogService,
  ) { this.fb = fb; }

  get code(): IFormControl<string> { return this.customerForm.get('code') as FormControl; }
  get customerName(): FormControl { return this.customerForm.get('CustomerName') as FormControl; }

  ngOnInit(): void {
    this.customerForm = this.fb.group<NewCustomer>({
      CustomerName: [
        '',
        [Validators.required],
        [this.validateCode('CustomerName')]
      ],
      code: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(3)],
        [this.validateCode('code')]
      ],
      disabled: [false],
      description: [''],
    });
  }

  onSave(): void {
    const code = (this.code.value as string).toUpperCase();
    this.code.setValue(code, { emitEvent: false });
    this.service.saveNewCustomer(this.customerForm.value).pipe(
      filter(id => !!id),
      tap(id => this.customerForm.markAsPristine()),
      tap(id => id && this.router.navigate(['..', 'edit', { id }], { relativeTo: this.route })),
    ).subscribe();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.customerForm.pristine) {
      return true;
    }
    return this.dialog.discardChanges();
  }

  private validateCode(field: keyof Customer): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.service.validator(field, control.value).pipe(
        map(val => val ? null : { occupied: control.value })
      );
    };
  }


}
