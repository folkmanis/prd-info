import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { InvoicesTotals } from '../../interfaces';

@Component({
  selector: 'app-selection-totals',
  templateUrl: './selection-totals.component.html',
  styleUrls: ['./selection-totals.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionTotalsComponent implements OnInit {
  @Input('totals') set totals(_val: InvoicesTotals) {
    this._totals = _val;
  }
  get totals(): InvoicesTotals {
    return this._totals;
  }

  private _totals: InvoicesTotals;
  constructor() { }

  ngOnInit(): void {
  }

}
