import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { IFormGroup } from '@rxweb/types';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { Customer, SystemPreferences } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { CONFIG } from 'src/app/services/config.provider';
import { CustomersService } from 'src/app/services/customers.service';
import { CustomersFormSource } from '../services/customers-form-source';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerEditComponent implements OnInit, CanComponentDeactivate {

  @ViewChild('paytraqPanel') paytraqPanel: MatExpansionPanel;

  paytraqDisabled$ = this.config$.pipe(
    pluck('paytraq', 'enabled'),
    map(enabled => !enabled),
  );

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
  ) { }

  formSource = new CustomersFormSource(this.fb, this.customersService);

  onDataChange(obj: Customer) {
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
