import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { CustomersFormSource } from '../services/customers-form-source';
import { CustomersService } from 'src/app/services/customers.service';
import { IFormGroup } from '@rxweb/types';
import { Customer } from 'src/app/interfaces';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent implements OnInit, CanComponentDeactivate {

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
  ) { }

  formSource = new CustomersFormSource(this.fb, this.customersService);

  get form(): IFormGroup<Customer> { return this.formSource.form; }
  get isNew(): boolean { return this.formSource.isNew; }

  ngOnInit(): void {
  }

  canDeactivate(): boolean {
    return this.form.pristine;
  }

}
