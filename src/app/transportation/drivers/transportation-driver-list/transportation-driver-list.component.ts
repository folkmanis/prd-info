import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { withPreviousValue } from 'src/app/library/signals';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { TransportationDriverService } from '../services/transportation-driver.service';

@Component({
  selector: 'app-transportation-driver',
  imports: [SimpleListContainerComponent, MatTableModule, RouterLink, RouterLinkActive],
  templateUrl: './transportation-driver-list.component.html',
  styleUrl: './transportation-driver-list.component.scss',
})
export class TransportationDriverListComponent {
  #driversResource = inject(TransportationDriverService).getDriversResource({ disabled: true });
  drivers = withPreviousValue(this.#driversResource);

  displayColumns = ['name'];

  onReload() {
    this.#driversResource.reload();
  }
}
