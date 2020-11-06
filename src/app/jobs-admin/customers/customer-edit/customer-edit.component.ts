import { Component, OnInit } from '@angular/core';
import { CustomersFormService } from '../services/customers-form.service';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent implements OnInit, CanComponentDeactivate {

  constructor(
    private formService: CustomersFormService,
  ) { }

  form = this.formService.form;
  get isNew(): boolean { return this.formService.isNew; }

  ngOnInit(): void {
  }

  canDeactivate(): boolean {
    return this.form.pristine;
  }

}
