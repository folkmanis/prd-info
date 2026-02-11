import { ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal, signal, untracked } from '@angular/core';
import { debounce, disabled, form, FormField, min, required, submit, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { isEqual, omitBy } from 'lodash-es';
import { FuelType } from 'src/app/interfaces';
import { assertNotNull, ConfirmationDialogService } from 'src/app/library';
import { InputUppercaseDirective } from 'src/app/library/directives/input-uppercase.directive';
import { CanComponentDeactivate } from 'src/app/library/guards';
import { navigateRelative } from 'src/app/library/navigation';
import { SimpleContentContainerComponent } from 'src/app/library/simple-form/simple-content-container/simple-content-container.component';
import { OdometerReading, TransportationVehicle, TransportationVehicleCreate, TransportationVehicleUpdate } from '../../interfaces/transportation-vehicle';
import { TransportationVehicleService } from '../../services/transportation-vehicle.service';
import { TransportationVehiclesListComponent } from '../transportation-vehicles-list/transportation-vehicles-list.component';
import { OdometerReadingsComponent } from './odometer-readings/odometer-readings.component';
import { computedSignalChanges } from 'src/app/library/signals';

const EDITABLE_PROPERTIES = ['name', 'licencePlate', 'passportNumber', 'vin', 'consumption', 'fuelType', 'disabled'] as const;
type FormValue = { [P in keyof Pick<TransportationVehicle, (typeof EDITABLE_PROPERTIES)[number]>]-?: NonNullable<TransportationVehicle[P]> };

@Component({
  selector: 'app-transportation-vehicle-edit',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    MatCheckbox,
    InputUppercaseDirective,
    MatSelect,
    MatOption,
    MatDivider,
    OdometerReadingsComponent,
    MatCardModule,
    SimpleContentContainerComponent,
    FormField,
  ],
  templateUrl: './transportation-vehicle-edit.component.html',
  styleUrl: './transportation-vehicle-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportationVehicleEditComponent implements CanComponentDeactivate {
  #vehicleService = inject(TransportationVehicleService);
  #navigate = navigateRelative();
  #confirmation = inject(ConfirmationDialogService);
  #listComponent = inject(TransportationVehiclesListComponent);

  fuelTypes = this.#vehicleService.fuelTypes;
  vehicle = input.required<TransportationVehicle>();

  protected initialValue = linkedSignal(() => this.vehicle());
  #initialModel = linkedSignal(() => this.#toFormValue(this.initialValue()));

  #vehicleModel = signal<FormValue>({
    name: '',
    licencePlate: '',
    passportNumber: '',
    vin: '',
    consumption: 0,
    fuelType: {
      type: '',
      description: '',
      units: '',
    },
    disabled: false,
  });
  protected vehicleForm = form(this.#vehicleModel, (schema) => {
    disabled(schema, () => this.editActive() === false);
    disabled(schema, () => this.busy());

    required(schema.name, { message: 'Nosaukums ir obligāts' });
    debounce(schema.name, 300);
    this.#vehicleService.validate(schema.name, 'name', this.initialValue);

    required(schema.licencePlate, { message: 'Numurs ir obligāts' });
    debounce(schema.licencePlate, 300);
    this.#vehicleService.validate(schema.licencePlate, 'licencePlate', this.initialValue);

    debounce(schema.passportNumber, 300);
    this.#vehicleService.validate(schema.passportNumber, 'passportNumber', this.initialValue);

    debounce(schema.vin, 300);
    this.#vehicleService.validate(schema.vin, 'vin', this.initialValue);

    required(schema.fuelType);
    validate(schema.fuelType, ({ value }) => (value().type ? null : { kind: 'not_set', message: `Jānorāda obligāti` }));

    disabled(schema.consumption, ({ valueOf }) => !valueOf(schema.fuelType).units);
    required(schema.consumption);
    min(schema.consumption, 0);
  });

  protected odometerReadings = computed(() => this.initialValue().odometerReadings);

  protected busy = signal(false);
  protected editActive = signal(false);

  isNew = computed(() => !this.initialValue()._id);

  changes = computedSignalChanges(this.#vehicleModel, this.#initialModel);

  fuelCompareWith = (o1: FuelType, o2: FuelType) => o1 && o2 && o1.type === o2.type;

  constructor() {
    effect(() => {
      this.initialValue();
      untracked(() => {
        this.onReset();
      });
    });
  }

  canDeactivate() {
    return this.vehicleForm().dirty() === false || this.changes() === null;
  }

  protected onReset() {
    this.#vehicleModel.set(this.#toFormValue(this.initialValue()));
    if (this.initialValue()._id) {
      this.editActive.set(false);
    } else {
      this.editActive.set(true);
    }
    this.busy.set(false);
    this.vehicleForm().reset();
  }

  protected onSave() {
    submit(this.vehicleForm, async () => {
      const id = this.initialValue()._id;
      this.busy.set(true);
      if (id) {
        await this.#updateVehicle(id);
      } else {
        await this.#createVehicle();
      }
      this.#listComponent.onReload();
    });
  }

  async onDelete() {
    const id = this.initialValue()._id;
    if (!id) {
      return;
    }
    const confirmed = await this.#confirmation.confirmDelete();
    if (confirmed) {
      await this.#vehicleService.delete(id);
      this.#listComponent.onReload();
      this.vehicleForm().reset();
      this.#navigate(['..'], { queryParams: { del: Date.now() } });
    }
  }

  protected async onOdometerUpdate(odometerReadings: OdometerReading[]) {
    const id = this.initialValue()._id;
    assertNotNull(id);
    const response = await this.#vehicleService.update(id, { odometerReadings });
    this.initialValue.set(response);
  }

  async #updateVehicle(id: string) {
    const update = this.changes();
    if (!update) {
      return;
    }
    const response = await this.#vehicleService.update(id, this.#toVehicleUpdate(update));
    this.initialValue.set(response);
    this.#listComponent.onReload();
    this.vehicleForm().reset();
  }

  async #createVehicle() {
    const { _id } = await this.#vehicleService.create(this.#toVehicleCreate(this.#vehicleModel()));
    this.vehicleForm().reset();
    this.#navigate(['..', _id]);
  }

  #toFormValue(vehicle: TransportationVehicle): FormValue {
    return {
      name: vehicle.name,
      licencePlate: vehicle.licencePlate,
      passportNumber: vehicle.passportNumber ?? '',
      vin: vehicle.vin ?? '',
      consumption: vehicle.consumption,
      fuelType: vehicle.fuelType,
      disabled: vehicle.disabled,
    };
  }

  #toVehicleCreate(value: FormValue): TransportationVehicleCreate {
    return {
      ...value,
      licencePlate: value.licencePlate.toUpperCase(),
      passportNumber: value.passportNumber.toUpperCase() || null,
      vin: value.vin.toUpperCase() || null,
      odometerReadings: [],
    };
  }

  #toVehicleUpdate(value: Partial<FormValue>): TransportationVehicleUpdate {
    console.log(value);
    const update: TransportationVehicleUpdate = { ...value };
    for (const key of ['licencePlate', 'passportNumber', 'vin']) {
      if (value[key] !== undefined) {
        update[key] = value[key].toUpperCase() || null;
      }
    }
    return update;
  }
}
