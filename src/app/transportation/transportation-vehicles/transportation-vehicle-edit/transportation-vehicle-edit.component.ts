import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncValidatorFn, FormBuilder, FormsModule, ReactiveFormsModule, Validators, ValueChangeEvent } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { isEqual, omitBy } from 'lodash-es';
import { filter, map } from 'rxjs';
import { FuelTypeInterface } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library';
import { navigateRelative } from 'src/app/library/navigation';
import { DisableControlDirective } from 'src/app/library/directives/disable-control.directive';
import { InputUppercaseDirective } from 'src/app/library/directives/input-uppercase.directive';
import { CanComponentDeactivate } from 'src/app/library/guards';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { TransportationVehicle } from '../../interfaces/transportation-vehicle';
import { TransportationVehicleService } from '../../services/transportation-vehicle.service';

type FormValue = Partial<Omit<TransportationVehicle, 'id'>>;

@Component({
    selector: 'app-transportation-vehicle-edit',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SimpleFormContainerComponent,
        MatFormFieldModule,
        MatInputModule,
        MatButton,
        MatCheckbox,
        InputUppercaseDirective,
        MatSelect,
        MatOption,
        MatDivider,
        DisableControlDirective,
    ],
    templateUrl: './transportation-vehicle-edit.component.html',
    styleUrl: './transportation-vehicle-edit.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransportationVehicleEditComponent implements CanComponentDeactivate {
  private vehicleService = inject(TransportationVehicleService);
  private navigate = navigateRelative();
  private confirmation = inject(ConfirmationDialogService);

  fuelTypes = this.vehicleService.fuelTypes;

  form = inject(FormBuilder).group({
    name: [null as string | null, [Validators.required], [this.nameValidator()]],
    licencePlate: [null as string | null, [Validators.required], [this.licencePlateValidator()]],
    consumption: [null as null | number, [Validators.required, Validators.min(0)]],
    fuelType: [null as null | FuelTypeInterface, [Validators.required]],
    disabled: [false],
  });

  initialValue = input.required<TransportationVehicle>({ alias: 'vehicle' });

  isNew = computed(() => !this.initialValue()._id);

  value$ = this.form.events.pipe(
    filter((event) => event instanceof ValueChangeEvent),
    map((event) => event.value as FormValue),
  );

  value = toSignal(this.value$, { initialValue: this.form.value });

  changes = computed(() => {
    const value = this.value();
    const initialValue = this.initialValue();
    const diff = omitBy(value, (val, key) => val === null || isEqual(val, initialValue[key])) as Partial<TransportationVehicle>;
    return Object.keys(diff).length ? diff : null;
  });

  fuelCompareWith = (o1: FuelTypeInterface, o2: FuelTypeInterface) => o1 && o2 && o1.type === o2.type;

  constructor() {
    effect(
      () => {
        this.form.reset(this.initialValue());
      },
      { allowSignalWrites: true },
    );
  }

  canDeactivate() {
    return this.form.pristine || this.changes() === null;
  }

  onReset() {
    this.form.reset(this.initialValue());
  }

  async onSave() {
    const update = this.changes();
    if (!update) {
      return;
    }
    let id = this.initialValue()._id;
    if (id) {
      await this.vehicleService.update({ _id: id, ...update });
    } else {
      const created = await this.vehicleService.create(update as Omit<TransportationVehicle, 'id'>);
      id = created._id;
    }
    this.form.markAsPristine();
    this.navigate(['..', id], { queryParams: { upd: Date.now() } });
  }

  async onDelete() {
    const id = this.initialValue()._id;
    if (!id) {
      return;
    }
    const confirmed = await this.confirmation.confirmDelete();
    if (confirmed) {
      await this.vehicleService.delete(id);
      this.form.markAsPristine();
      this.navigate(['..'], { queryParams: { del: Date.now() } });
    }
  }

  private nameValidator(): AsyncValidatorFn {
    return async (control) => {
      const name = control.value;
      if (!name || name === this.initialValue().name) {
        return null;
      }

      return (await this.vehicleService.validateName(name)) ? null : { nameTaken: name };
    };
  }

  private licencePlateValidator(): AsyncValidatorFn {
    return async (control) => {
      const licencePlate = control.value;
      if (!licencePlate || licencePlate === this.initialValue().licencePlate) {
        return null;
      }

      return (await this.vehicleService.validateLicencePlate(licencePlate)) ? null : { licencePlateTaken: licencePlate };
    };
  }
}
