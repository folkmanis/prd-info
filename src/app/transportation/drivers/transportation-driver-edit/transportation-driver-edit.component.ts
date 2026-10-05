import { Component, computed, effect, inject, linkedSignal, model, signal } from '@angular/core';
import {
  applyWhen,
  disabled,
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  readonly,
  required,
  SchemaPath,
} from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { PendingSuffix } from 'src/app/library';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { CanComponentDeactivate } from 'src/app/library/guards';
import { navigateRelative } from 'src/app/library/navigation';
import { computedChanges, computedSignalChanges } from 'src/app/library/signals';
import { SimpleContentContainerComponent } from 'src/app/library/simple-form/simple-content-container/simple-content-container.component';
import { updateCatching } from 'src/app/library/update-catching';
import { Driver } from '../schemas/transportation-driver';
import { TransportationDriverService } from '../services/transportation-driver.service';
import { TransportationDriverListComponent } from '../transportation-driver-list/transportation-driver-list.component';
import { DriverModel, driverToModel, modelToDriverCreate, modelToDriverUpdate } from './driver-edit.model';

const NAME_MINLENGTH = 3;

@Component({
  selector: 'app-transportation-driver-edit',
  imports: [
    MatFormFieldModule,
    MatInput,
    MatCheckbox,
    MatButton,
    FormField,
    FormRoot,
    SimpleContentContainerComponent,
    MatCardModule,
    PendingSuffix,
  ],
  templateUrl: './transportation-driver-edit.component.html',
  styleUrl: './transportation-driver-edit.component.scss',
})
export class TransportationDriverEditComponent implements CanComponentDeactivate {
  #driverService = inject(TransportationDriverService);
  #navigate = navigateRelative();
  #confirmation = inject(ConfirmationDialogService);
  #listComponent = inject(TransportationDriverListComponent);

  driver = model.required<Driver>();
  #initialModel = linkedSignal(() => driverToModel(this.driver()));
  #formModel = linkedSignal(() => this.#initialModel());

  protected isNew = computed(() => !this.driver()._id);
  protected busy = signal(false);
  #updateFn = updateCatching(this.busy);
  protected deleting = signal(false);
  #deleteFn = updateCatching(this.deleting);

  form = form(
    this.#formModel,
    (schema) => {
      disabled(schema, { when: () => this.busy() });

      readonly(schema.name, { when: () => this.isNew() === false });
      required(schema.name, { message: `Jānorāda obligāti` });
      minLength(schema.name, NAME_MINLENGTH, { message: `Jāsatur vismaz 3 zīmes` });
      maxLength(schema.name, 255);
      this.#nameValidator(schema.name);
    },
    {
      submission: {
        ignoreValidators: 'none',
        action: async (tree) => {
          const value = tree().value();
          const id = this.driver()._id;
          if (id) {
            await this.#onUpdate(id, value);
          } else {
            await this.#onCreate(value);
          }
        },
      },
    },
  );

  protected changes = computedSignalChanges(this.#formModel, this.#initialModel);

  constructor() {
    effect(() => {
      this.#initialModel();
      this.form().reset();
    });
  }

  canDeactivate() {
    return this.form().dirty() === false || this.changes() === null;
  }

  onReset() {
    this.#initialModel.set(driverToModel(this.driver()));
  }

  async #onUpdate(id: string, m: DriverModel) {
    return this.#updateFn(async (message) => {
      const changes = computedChanges(m, this.#initialModel());
      if (changes) {
        const result = await this.#driverService.update(id, modelToDriverUpdate(changes));
        this.driver.set(result);
        this.#listComponent.onReload();
        message(`Izmaiņas saglabātas`);
      }
    });
  }

  async #onCreate(m: DriverModel) {
    return this.#updateFn(async (message) => {
      const driver = modelToDriverCreate(m);
      const result = await this.#driverService.create(driver);
      this.#listComponent.onReload();
      this.form().reset();
      this.#navigate(['..', result._id]);
      message(`Ieraksts izveidots`);
    });
  }

  async onDelete() {
    this.#deleteFn(async (message) => {
      const id = this.driver()._id;
      if (id && (await this.#confirmation.confirmDelete())) {
        await this.#driverService.delete(id);
        message(`Ieraksts izdzēsts`);
        this.#listComponent.onReload();
        this.form().reset();
        this.#navigate(['..']);
      }
    });
  }

  #nameValidator(schema: SchemaPath<string>): void {
    applyWhen(
      schema,
      ({ value }) => value() !== this.#initialModel().name,
      (s) => {
        this.#driverService.validate(s, 'name');
      },
    );
  }
}
