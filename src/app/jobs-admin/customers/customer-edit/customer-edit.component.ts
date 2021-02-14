import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { CustomersFormSource } from '../services/customers-form-source';
import { CustomersService } from 'src/app/services/customers.service';
import { IFormGroup } from '@rxweb/types';
import { Customer } from 'src/app/interfaces';
import { map, pluck } from 'rxjs/operators';
import { SystemPreferencesService } from 'src/app/services';
import { MatExpansionPanel } from '@angular/material/expansion';
import { SimpleFormControl } from 'src/app/library/simple-form';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: SimpleFormControl, useExisting: CustomerEditComponent },
  ]
})
export class CustomerEditComponent implements OnInit, CanComponentDeactivate, SimpleFormControl<Customer> {

  @ViewChild('paytraqPanel') paytraqPanel: MatExpansionPanel;

  paytraqDisabled$ = this.systemPreferencesService.preferences$.pipe(
    pluck('paytraq', 'enabled'),
    map(enabled => !enabled),
  );

  constructor(
    private fb: FormBuilder,
    private systemPreferencesService: SystemPreferencesService,
    private customersService: CustomersService,
  ) { }

  formSource = new CustomersFormSource(this.fb, this.customersService);

  writeValue(obj: Customer) {
    this.paytraqPanel?.close();
    this.formSource.initValue(obj);
  }

  get form(): IFormGroup<Customer> { return this.formSource.form; }
  get isNew(): boolean { return this.formSource.isNew; }

  ngOnInit(): void {
  }

  canDeactivate(): boolean {
    return this.form.pristine;
  }

}
