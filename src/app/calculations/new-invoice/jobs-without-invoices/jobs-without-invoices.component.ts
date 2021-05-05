import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JobsWithoutInvoicesTotals } from 'src/app/interfaces';

@Component({
  selector: 'app-jobs-without-invoices',
  templateUrl: './jobs-without-invoices.component.html',
  styleUrls: ['./jobs-without-invoices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsWithoutInvoicesComponent  {

  @Input() set noInvoices(value: JobsWithoutInvoicesTotals[]) {
    if (!value) { return; }
    this._noInvoices = value;
  }
  get noInvoices(): JobsWithoutInvoicesTotals[] {
    return this._noInvoices;
  }
  private _noInvoices: JobsWithoutInvoicesTotals[] = [];

  constructor(
  ) { }


}
