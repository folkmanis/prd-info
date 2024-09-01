import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { isEqual, pickBy } from 'lodash-es';
import { navigateRelative } from 'src/app/library/common';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { CanComponentDeactivate } from 'src/app/library/guards';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { TransportationDriver } from '../../interfaces/transportation-driver';
import { FuelPurchase, RouteTrip, TransportationRouteSheet } from '../../interfaces/transportation-route-sheet';
import { TransportationVehicle } from '../../interfaces/transportation-vehicle';
import { RouteSheetService } from '../../services/route-sheet.service';
import { TransportationDriverService } from '../../services/transportation-driver.service';
import { TransportationVehicleService } from '../../services/transportation-vehicle.service';
import { FuelPurchasesComponent } from './fuel-purchases/fuel-purchases.component';
import { GeneralSetupComponent } from './general-setup/general-setup.component';

@Component({
  selector: 'app-route-sheet-edit',
  standalone: true,
  imports: [
    AsyncPipe,
    SimpleFormContainerComponent,
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatDivider,
    MatButton,
    GeneralSetupComponent,
    FuelPurchasesComponent,
  ],
  templateUrl: './route-sheet-edit.component.html',
  styleUrl: './route-sheet-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteSheetEditComponent implements CanComponentDeactivate {
  private readonly routeSheetService = inject(RouteSheetService);
  private navigate = navigateRelative();
  private readonly confirmation = inject(ConfirmationDialogService);

  drivers = inject(TransportationDriverService).driversActive;

  vehicles = inject(TransportationVehicleService).vehiclesActive;

  // src/app/transportation/route-sheets/route-sheet-edit/route-sheet-edit.component.ts
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

  changes = computed(() => {
    console.log('changes');

    const value = this.formValue();
    const initialValue = this.initialValue();
    const diff = pickBy(value, (v, key) => v !== null && !isEqual(v, initialValue[key]));
    return Object.keys(diff).length ? diff : undefined;
  });

  constructor() {
    effect(
      () => {
        console.log('reset');
        this.form.reset(this.initialValue());
      },
      { allowSignalWrites: true },
    );
  }

  canDeactivate = () => this.form.pristine;

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