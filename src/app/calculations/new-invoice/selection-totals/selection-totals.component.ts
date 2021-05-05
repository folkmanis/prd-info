import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { InvoicesTotals } from '../../interfaces';
import { JobPartial, JobProduct, Product, ProductTotals } from 'src/app/interfaces';

@Component({
  selector: 'app-selection-totals',
  templateUrl: './selection-totals.component.html',
  styleUrls: ['./selection-totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionTotalsComponent implements OnInit {

  @Input() set invoicesTotals(value: InvoicesTotals) {
    if (!value) { return; }
    this._invoicesTotals = value;
  }
  get invoicesTotals(): InvoicesTotals {
    return this._invoicesTotals;
  }
  private _invoicesTotals: InvoicesTotals = { totals: [], grandTotal: 0 };

  constructor() { }

  ngOnInit(): void {
  }

}
