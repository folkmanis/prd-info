import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, ValueChangeEvent } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { isEqual, pickBy } from 'lodash-es';
import { filter, map, of, switchMap } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { CanComponentDeactivate } from 'src/app/library/guards';
import { navigateRelative } from 'src/app/library/navigation';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { TransportationDriver } from '../../interfaces/transportation-driver';
import { FuelPurchase, RouteTrip, TransportationRouteSheet } from '../../interfaces/transportation-route-sheet';
import { TransportationVehicle } from '../../interfaces/transportation-vehicle';
import { RouteSheetService } from '../../services/route-sheet.service';
import { TransportationDriverService } from '../../services/transportation-driver.service';
import { TransportationVehicleService } from '../../services/transportation-vehicle.service';
import { FuelPurchasesComponent } from './fuel-purchases/fuel-purchases.component';
import { GeneralSetupComponent } from './general-setup/general-setup.component';
import { RouteTripsComponent } from './route-trips/route-trips.component';

@Component({
    selector: 'app-route-sheet-edit',
    imports: [
        AsyncPipe,
        SimpleFormContainerComponent,
        FormsModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatDivider,
        MatButtonModule,
        GeneralSetupComponent,
        FuelPurchasesComponent,
        RouteTripsComponent,
    ],
    templateUrl: './route-sheet-edit.component.html',
    styleUrl: './route-sheet-edit.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteSheetEditComponent implements CanComponentDeactivate {
  private readonly routeSheetService = inject(RouteSheetService);
  private navigate = navigateRelative();
  private readonly confirmation = inject(ConfirmationDialogService);

  drivers = inject(TransportationDriverService).driversActive;

  vehicles = inject(TransportationVehicleService).vehiclesActive;

  customers$ = this.routeSheetService.getCustomers();

  form = inject(FormBuilder).group({
    year: [null as number | null, { validators: [Validators.required, Validators.min(1990)] }],
    month: [null as number | null, { validators: [Validators.required, Validators.min(1), Validators.max(12)] }],
    fuelRemainingStartLitres: [0, { validators: [Validators.required, Validators.min(0)] }],
    driver: [null as TransportationDriver | null, { validators: [Validators.required] }],
    vehicle: [null as TransportationVehicle | null, { validators: [Validators.required] }],
    trips: [[] as RouteTrip[]],
    fuelPurchases: [[] as FuelPurchase[]],
  });

  initialValue = input.required<TransportationRouteSheet>({ alias: 'routeSheet' });

  formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  generalValid = computed(() => {
    this.formStatus();
    const controlNames = ['year', 'month', 'driver', 'vehicle', 'fuelRemainingStartLitres'];
    return controlNames.every((key) => this.form.controls[key].valid);
  });

  changes = computed(() => {
    const value = this.formValue();
    const initialValue = this.initialValue();
    const diff = pickBy(value, (v, key) => v !== null && !isEqual(v, initialValue[key]));
    return Object.keys(diff).length ? diff : undefined;
  });

  startDate = computed(() => {
    if (this.generalValid()) {
      const { year, month } = this.formValue();
      return new Date(year, month - 1);
    } else {
      return null;
    }
  });

  historicalData$ = this.form.controls.vehicle.events.pipe(
    filter((event) => event instanceof ValueChangeEvent),
    map((event: ValueChangeEvent<TransportationVehicle>) => event.value?.licencePlate),
    switchMap((licencePlate) => (licencePlate ? this.routeSheetService.getHistoricalData(licencePlate) : of(null))),
  );

  constructor() {
    toObservable(this.initialValue).subscribe((data) => this.form.reset(data));
  }

  canDeactivate = () => this.form.pristine || !this.changes();

  async onSave() {
    let id = this.initialValue()._id;
    try {
      if (!id) {
        const data = this.form.getRawValue();
        id = (await this.routeSheetService.createRouteSheet(data))._id;
      } else {
        const data = this.changes();
        await this.routeSheetService.updateRouteSheet(id, data);
      }
      this.form.markAsPristine();
      this.navigate(['..', id], { queryParams: { upd: Date.now() } });
    } catch (error) {
      this.confirmation.confirmDataError(error.message);
    }
  }

  onReset() {
    this.form.reset(this.initialValue());
  }

  async onDelete() {
    const id = this.initialValue()._id;
    if (id && (await this.confirmation.confirmDelete())) {
      try {
        await this.routeSheetService.deleteRouteSheet(id);
        this.form.markAsPristine();
        this.navigate(['..']);
      } catch (error) {
        this.confirmation.confirmDataError(error.message);
      }
    }
  }
}
