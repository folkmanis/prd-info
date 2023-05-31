import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { InvoiceCustomerSelector } from './invoice-customer-selector.class';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-customer-selector',
  standalone: true,
  templateUrl: './customer-selector.component.html',
  styleUrls: ['./customer-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
  ],
  providers: [{
    provide: InvoiceCustomerSelector,
    useExisting: CustomerSelectorComponent,
  }],
})
export class CustomerSelectorComponent implements OnInit, InvoiceCustomerSelector {

  @Input({ required: true }) customers: { _id: string; }[] = [];

  customerId = new FormControl<string>('');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.customerId.setValue(this.route.snapshot.queryParamMap.get('customer') || '');

    this.customerId.valueChanges
      .subscribe(customer => this.router.navigate(['.'], { relativeTo: this.route, queryParams: { customer } }));

  }

  setCustomer(id: string): void {
    this.customerId.setValue(id);
  }


}
