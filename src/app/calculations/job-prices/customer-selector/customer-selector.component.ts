import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { distinctUntilChanged, Observable, map } from 'rxjs';
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

  customerControl = new FormControl('');

  @Input()
  customers: JobsWithoutInvoicesTotals[] = [];

  @Input()
  set customer(value: string | undefined) {
    if (value !== this.customerControl.value) {
      this.customerControl.setValue(value || '', { emitEvent: false });
    }
  }

  get allTotals() {
    return this.customers.reduce((acc, curr) => acc + curr.noPrice, 0);
  }

  @Output()
  customerChanges: Observable<string> = this.customerControl.valueChanges
    .pipe(map(value => value || null),);


}
