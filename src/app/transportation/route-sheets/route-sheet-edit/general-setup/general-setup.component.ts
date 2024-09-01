import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ControlContainer, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { TransportationDriver } from 'src/app/transportation/interfaces/transportation-driver';
import { TransportationVehicle } from 'src/app/transportation/interfaces/transportation-vehicle';

@Component({
  selector: 'app-general-setup',
  standalone: true,
  imports: [MatFormFieldModule, MatInput, MatSelect, FormsModule, ReactiveFormsModule, MatOption],
  templateUrl: './general-setup.component.html',
  styleUrl: './general-setup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (): ControlContainer => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class GeneralSetupComponent {
  drivers = input<TransportationDriver[]>([]);
  driverCompareFn = (d1: TransportationDriver, d2: TransportationDriver) => d1?._id === d2?._id;

  vehicles = input<TransportationVehicle[]>([]);
  vehicleCompareFn = (v1: TransportationVehicle, v2: TransportationVehicle) => v1?._id === v2?._id;
}
