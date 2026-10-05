import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SimpleListContainerComponent } from 'src/app/library';
import { TransportationVehicleService } from '../services/transportation-vehicle.service';

@Component({
  selector: 'app-transportation-vehicles-list',
  imports: [SimpleListContainerComponent, MatTableModule, RouterLink, RouterLinkActive, DecimalPipe],
  templateUrl: './transportation-vehicles-list.component.html',
  styleUrl: './transportation-vehicles-list.component.scss',
})
export class TransportationVehiclesListComponent {
  vehicles = inject(TransportationVehicleService).getVehiclesResource();
  displayedColumns = ['name', 'licencePlate', 'fuelType', 'consuption'];

  onReload() {
    this.vehicles.reload();
  }
}
