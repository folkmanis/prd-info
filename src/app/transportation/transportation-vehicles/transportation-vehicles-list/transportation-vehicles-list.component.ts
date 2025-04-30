import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TransportationVehicleService } from '../../services/transportation-vehicle.service';
import { MatTableModule } from '@angular/material/table';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-transportation-vehicles-list',
  imports: [SimpleListContainerComponent, MatTableModule, RouterLink, RouterLinkActive],
  templateUrl: './transportation-vehicles-list.component.html',
  styleUrl: './transportation-vehicles-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportationVehiclesListComponent {
  vehicles = inject(TransportationVehicleService).getVehiclesResource({});
  displayedColumns = ['name', 'licencePlate', 'fuelType', 'consuption'];

  onReload() {
    this.vehicles.reload();
  }
}
