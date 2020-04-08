import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, filter, tap, switchMap, debounceTime, takeUntil } from 'rxjs/operators';
import { isEqual, pick, omit, keys } from 'lodash';

import { ProductsService } from '../services/products.service';
import { Product } from '../../services/jobs-admin.interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { LoginService } from 'src/app/login/login.service';
import { JobsSettings } from 'src/app/library/classes/system-preferences-class';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit, CanComponentDeactivate {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ProductsService,
    private loginService: LoginService,
    private dialog: ConfirmationDialogService,
  ) { }

  readonly categories$ = this.service.categories$;
  private readonly productFormControls: { [key: string]: any; } = {
    name: [
      '',
      {
        validators: Validators.required,
        asyncValidators: this.nameValidator('name'),
      }
    ],
    category: ['', { validators: Validators.required }],
    description: [''],
  };
  productForm: FormGroup = this.fb.group(this.productFormControls);
  get nameF(): AbstractControl { return this.productForm.get('name'); }
  get categoryF(): AbstractControl { return this.productForm.get('category'); }

  ngOnInit(): void {
  }

  onSave(): void {
    this.service.insertProduct(this.productForm.value).pipe(
      tap(() => this.productForm.markAsPristine()),
      switchMap(id => this.router.navigate(['..', 'edit', { id }], { relativeTo: this.route })),
    ).subscribe();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.productForm.pristine) {
      return true;
    }
    return this.dialog.discardChanges();
  }

  private nameValidator(contr: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.service.validate(contr, control.value).pipe(
        map(valid => valid ? null : { occupied: control.value })
      );
    };
  }

}
