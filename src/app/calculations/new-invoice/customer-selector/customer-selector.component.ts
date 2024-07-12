import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-selector',
  standalone: true,
  templateUrl: './customer-selector.component.html',
  styleUrls: ['./customer-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule],
})
export class CustomerSelectorComponent implements OnInit {
  @Input({ required: true }) customers: { _id: string }[] = [];

  customerId = new FormControl<string>('');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.customerId.setValue(this.route.snapshot.queryParamMap.get('customer') || '');

    this.customerId.valueChanges.subscribe((customer) =>
      this.router.navigate(['.'], {
        relativeTo: this.route,
        queryParams: { customer },
      }),
    );
  }

  setCustomer(id: string): void {
    this.customerId.setValue(id);
  }
}
