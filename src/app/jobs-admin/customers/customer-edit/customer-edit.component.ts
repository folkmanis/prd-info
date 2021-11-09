import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { IFormGroup } from '@rxweb/types';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { Customer, SystemPreferences } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { CONFIG } from 'src/app/services/config.provider';
import { CustomersFormSource } from '../services/customers-form-source';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: SimpleFormSource, useExisting: CustomersFormSource }
  ]
})
export class CustomerEditComponent implements OnInit, CanComponentDeactivate {

  @ViewChild('paytraqPanel') paytraqPanel: MatExpansionPanel;

  paytraqDisabled$ = this.config$.pipe(
    pluck('paytraq', 'enabled'),
    map(enabled => !enabled),
  );

  constructor(
    private formSource: CustomersFormSource,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
  ) { }

  get form(): IFormGroup<Customer> { return this.formSource.form; }
  get isNew(): boolean { return this.formSource.isNew; }

  onDataChange(obj: Customer) {
    this.paytraqPanel?.close();
    this.formSource.initValue(obj);
  }

  ngOnInit(): void {
  }

  canDeactivate(): boolean {
    return this.form.pristine;
  }

}
