import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncValidatorFn, FormBuilder, FormsModule, ReactiveFormsModule, Validators, ValueChangeEvent } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { isEqual, omitBy } from 'lodash-es';
import { filter, map } from 'rxjs';
import { navigateRelative } from 'src/app/library/navigation';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { CanComponentDeactivate } from 'src/app/library/guards';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { TransportationDriver } from '../../interfaces/transportation-driver';
import { TransportationDriverService } from '../../services/transportation-driver.service';
import { TransportationDriverListComponent } from '../transportation-driver-list/transportation-driver-list.component';

type FormValue = { [K in 'name' | 'disabled']?: TransportationDriver[K] | null };

@Component({
  selector: 'app-transportation-driver-edit',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInput, MatCheckbox, SimpleFormContainerComponent, MatButton, MatDivider],
  templateUrl: './transportation-driver-edit.component.html',
  styleUrl: './transportation-driver-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportationDriverEditComponent implements CanComponentDeactivate {
  #driverService = inject(TransportationDriverService);
  #navigate = navigateRelative();
  #confirmation = inject(ConfirmationDialogService);
  #listComponent = inject(TransportationDriverListComponent);

  form = inject(FormBuilder).group({
    name: ['', [Validators.required], [this.nameValidator()]],
    disabled: [false],
  });

  initialValue = input.required<TransportationDriver>({ alias: 'driver' });

  isNew = computed(() => !this.initialValue()._id);

  value$ = this.form.events.pipe(
    filter((event) => event instanceof ValueChangeEvent),
    map((event) => event.value as FormValue),
  );

  value = toSignal(this.value$, { initialValue: this.form.value });

  changes = computed(() => {
    const value = this.value();
    const initialValue = this.initialValue();
    const diff = omitBy(value, (val, key) => isEqual(val, initialValue[key])) as Partial<TransportationDriver>;
    return Object.keys(diff).length ? diff : null;
  });

  constructor() {
    effect(() => {
      this.form.reset(this.initialValue());
    });
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
      await this.#driverService.update(id, update);
      this.#listComponent.onReload();
    } else {
      const created = await this.#driverService.create(update as Omit<TransportationDriver, 'id'>);
      id = created._id;
      this.#listComponent.onReload();
    }
    this.form.markAsPristine();
    this.#navigate(['..', id], { queryParams: { upd: Date.now() } });
  }

  async onDelete() {
    const id = this.initialValue()._id;
    if (!id) {
      return;
    }
    const confirmed = await this.#confirmation.confirmDelete();
    if (confirmed) {
      await this.#driverService.delete(id);
      this.#listComponent.onReload();
      this.form.markAsPristine();
      this.#navigate(['..'], { queryParams: { del: Date.now() } });
    }
  }

  private nameValidator(): AsyncValidatorFn {
    return async (control) => {
      const name = control.value;
      if (!name || name === this.initialValue().name) {
        return null;
      }

      return (await this.#driverService.validateName(name)) ? null : { nameTaken: name };
    };
  }
}
