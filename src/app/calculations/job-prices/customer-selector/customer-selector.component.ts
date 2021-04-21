import { Component, OnInit, OnChanges, ChangeDetectionStrategy, Input, Output, SimpleChanges, SimpleChange } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { IFormControl } from '@rxweb/types';
import { Subject, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, tap } from 'rxjs/operators';
import { log } from 'prd-cdk';
import { JobsWithoutInvoicesTotals } from 'src/app/interfaces';

@Component({
  selector: 'app-customer-selector',
  templateUrl: './customer-selector.component.html',
  styleUrls: ['./customer-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerSelectorComponent {

  @Input() set customers(value: JobsWithoutInvoicesTotals[]) {
    this._customers = value || [];
    this.allTotals = this.customers.reduce((acc, curr) => acc + curr.noPrice, 0);
  }
  get customers(): JobsWithoutInvoicesTotals[] { return this._customers; }
  private _customers: JobsWithoutInvoicesTotals[] = [];

  @Input() set customer(value: string | undefined) {
    if (!value || value === this.customerControl.value) { return; }
    this.customerControl.setValue(value, { emitEvent: false });
  }

  customerControl: IFormControl<string> = new FormControl(undefined);

  allTotals: number | undefined;

  @Output() customerChanges: Observable<string> = this.customerControl.valueChanges.pipe(
    distinctUntilChanged(),
  );

  constructor() { }


}
