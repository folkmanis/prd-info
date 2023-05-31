import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { JobsWithoutInvoicesTotals } from 'src/app/jobs';

@Component({
  selector: 'app-customer-selector',
  standalone: true,
  templateUrl: './customer-selector.component.html',
  styleUrls: ['./customer-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
  ],
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

  customerControl = new FormControl<string>('');

  allTotals: number | undefined;

  @Output() customerChanges: Observable<string> = this.customerControl.valueChanges.pipe(
    distinctUntilChanged(),
  );

  constructor() { }


}
