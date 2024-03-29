import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CustomerPartial } from 'src/app/interfaces';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { CustomersService } from 'src/app/services';

@Component({
  standalone: true,
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
  imports: [
    MatTableModule,
    RouterLink,
    RouterLinkActive,
    SimpleListContainerComponent,
  ]
})
export class CustomersListComponent {

  name = signal('');

  customers = toSignal(inject(CustomersService).customers$, { initialValue: <CustomerPartial[]>[] });

  customersFiltered = computed(() => this
    .customers()
    .filter(cust => cust
      .CustomerName
      .toUpperCase()
      .includes(this.name().toUpperCase())
    )
  );

  displayedColumns = ['CustomerName'];

}
