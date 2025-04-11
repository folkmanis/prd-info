import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ControlContainer, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { HistoricalData } from 'src/app/transportation/interfaces/historical-data';
import { TransportationDriver } from 'src/app/transportation/interfaces/transportation-driver';
import { TransportationVehicle } from 'src/app/transportation/interfaces/transportation-vehicle';

@Component({
  selector: 'app-general-setup',
  imports: [MatFormFieldModule, MatInput, MatSelect, FormsModule, ReactiveFormsModule, MatOption, MatIconButton, MatIcon, MatTooltip, DatePipe, TitleCasePipe],
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
  private controlContainer = inject(ControlContainer, { skipSelf: true });

  private year = new Date().getFullYear();
  months = Array.from({ length: 12 }, (_, k) => k).map((month) => new Date(this.year, month));

  drivers = input<TransportationDriver[]>([]);
  driverCompareFn = (d1: TransportationDriver, d2: TransportationDriver) => d1?._id === d2?._id;

  vehicles = input<TransportationVehicle[]>([]);
  vehicleCompareFn = (v1: TransportationVehicle, v2: TransportationVehicle) => v1?._id === v2?._id;

  historicalData = input<HistoricalData | null>(null);

  setRemainingFuel(value: number) {
    this.controlContainer.control?.patchValue({ fuelRemainingStartLitres: value });
  }
}
