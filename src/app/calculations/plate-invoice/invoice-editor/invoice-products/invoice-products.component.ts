import { CurrencyPipe } from '@angular/common';
import { Component, booleanAttribute, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { InvoiceForReport } from 'src/app/interfaces';

const COLUMNS = ['_id', 'count', 'price', 'total'];

@Component({
  selector: 'app-invoice-products',
  templateUrl: './invoice-products.component.html',
  styleUrls: ['./invoice-products.component.scss'],
  imports: [MatTableModule, CurrencyPipe, MatButtonModule, RouterLink],
})
export class InvoiceProductsComponent {
  invoice = input.required<InvoiceForReport>();

  pyatraqEnabled = input(false, { transform: booleanAttribute });

  products = computed(() => this.invoice().products);

  total = computed(() => this.invoice().total || 0);

  displayedColumns = computed(() => (this.pyatraqEnabled() ? ['paytraqId', ...COLUMNS] : [...COLUMNS]));

  isJobsAdmin = input(false, { transform: booleanAttribute });
}
