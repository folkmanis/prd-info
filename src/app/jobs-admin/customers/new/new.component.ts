import { Component, OnInit } from '@angular/core';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { Observable, of } from 'rxjs';
import { FormGroup, FormBuilder, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomersService } from '../services/customers.service';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { map, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit, CanComponentDeactivate {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: CustomersService,
    private dialog: ConfirmationDialogService,
  ) { }
  customerForm: FormGroup = this.fb.group({
    CustomerName: [
      '', {
        validators: Validators.required,
        asyncValidators: this.validateCode('CustomerName'),
      }
    ],
    code: [
      '', {
        validators: Validators.required,
        asyncValidators: this.validateCode('code')
      }
    ],
    disabled: [false],
    description: [''],
  });
  get code(): AbstractControl { return this.customerForm.get('code'); }
  get customerName(): AbstractControl { return this.customerForm.get('CustomerName'); }

  ngOnInit(): void {
  }

  onSave(): void {
    this.service.saveCustomer(this.customerForm.value).pipe(
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

  private validateCode(field: 'code' | 'CustomerName'): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.service.validator({ [field]: control.value }).pipe(
        map(val => val ? null : { occupied: control.value })
      );
    };
  }


}
