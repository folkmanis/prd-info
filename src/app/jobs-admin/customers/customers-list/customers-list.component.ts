import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { CustomersService } from 'src/app/services';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
  imports: [MatTableModule, RouterLink, RouterLinkActive, SimpleListContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersListComponent {
  private readonly customersService = inject(CustomersService);

  name = signal('');

  customers = this.customersService.customers;

  customersFiltered = computed(() => this.customers.value()?.filter((cust) => cust.CustomerName.toUpperCase().includes(this.name().toUpperCase())));

  displayedColumns = ['CustomerName'];

  constructor() {
    this.customersService.setFilter({ disabled: true });
  }
}
