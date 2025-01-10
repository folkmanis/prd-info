import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { JobsWithoutInvoicesTotals } from 'src/app/jobs';

@Component({
  selector: 'app-customer-selector',
  templateUrl: './customer-selector.component.html',
  styleUrls: ['./customer-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatSelectModule, MatOptionModule, FormsModule],
})
export class CustomerSelectorComponent {
  customers = input([] as JobsWithoutInvoicesTotals[]);

  customer = model<string | null>();

  allTotals = computed(() => this.customers().reduce((acc, curr) => acc + curr.noPrice, 0));
}
