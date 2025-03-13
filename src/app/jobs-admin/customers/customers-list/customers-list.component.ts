import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { isEqual } from 'lodash-es';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { CustomerRequestFilter, CustomersService } from 'src/app/services';

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

  filter = computed(
    () => {
      const filter: CustomerRequestFilter = { disabled: true };
      const name = this.name().trim();
      if (name) {
        filter.name = name;
      }
      return filter;
    },
    { equal: isEqual },
  );

  customers = this.customersService.getCustomersResource(this.filter).asReadonly();

  displayedColumns = ['CustomerName'];

  onReload() {
    this.customers.reload();
  }
}
