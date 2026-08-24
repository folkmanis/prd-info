import { Component, computed, effect, inject, input, linkedSignal, signal, untracked } from '@angular/core';
import {
  applyWhen,
  disabled,
  FieldTree,
  form,
  FormField,
  FormRoot,
  minLength,
  required,
  SchemaPath,
} from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Equipment } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { navigateRelative } from 'src/app/library/navigation';
import { computedChanges } from 'src/app/library/signals';
import { SimpleContentContainerComponent } from 'src/app/library/simple-form/simple-content-container/simple-content-container.component';
import { updateCatching } from 'src/app/library/update-catching';
import { EquipmentListComponent } from '../equipment-list/equipment-list.component';
import { EquipmentService } from '../services/equipment.service';
import {
  EquipmentModel,
  equipmentToModel,
  modelToEquipmentCreate,
  modelToEquipmentUpdate,
} from './equipment-edit.model';

const NAME_MIN_LENGTH = 3;

@Component({
  selector: 'app-equipment-edit',
  templateUrl: './equipment-edit.component.html',
  styleUrls: ['./equipment-edit.component.scss'],
  imports: [
    FormField,
    FormRoot,
    SimpleContentContainerComponent,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinner,
    MatCheckbox,
  ],
})
export class EquipmentEditComponent implements CanComponentDeactivate {
  #equipmentService = inject(EquipmentService);
  #listComponent = inject(EquipmentListComponent);

  #navigate = navigateRelative();

  #busy = signal(false);
  #update = updateCatching(this.#busy);

  equipment = input.required<Equipment>();
  #initialValue = linkedSignal(() => this.equipment());
  #initialModel = computed(() => equipmentToModel(this.#initialValue()));
  #formModel = linkedSignal<EquipmentModel>(() => this.#initialModel());

  protected changes = computed(() => computedChanges(modelToEquipmentUpdate(this.#formModel()), this.#initialValue()));
  protected isNew = computed(() => !this.#initialValue()._id);

  protected form = form(
    this.#formModel,
    (schema) => {
      disabled(schema, { when: () => this.#busy() });

      required(schema.name, { message: `Nosaukums jāievada obligāti` });
      minLength(schema.name, NAME_MIN_LENGTH, { message: `Nosaukumam jābūt vismaz ${NAME_MIN_LENGTH} zīmes garam` });
      this.#validateName(schema.name);
    },
    {
      submission: {
        ignoreValidators: 'none',
        action: async (s) => {
          await this.#saveEquipment(s);
        },
      },
    },
  );

  constructor() {
    effect(() => {
      this.#initialValue();
      untracked(() => {
        this.form().reset();
      });
    });
  }

  canDeactivate = () => this.form().dirty() === false || this.changes() === null;

  protected onReset() {
    this.form().reset(this.#initialModel());
  }

  async #saveEquipment(schema: FieldTree<EquipmentModel>) {
    this.#update(async (message) => {
      const id = this.#initialValue()._id;
      if (id) {
        await this.#updateEquipment(schema().value(), id);
        message(`Izmaiņas saglabātas`);
      } else {
        const { name } = await this.#createEquipment(schema().value());
        message(`Aprīkojums ${name} izveidots`);
      }
    });
  }

  async #createEquipment(value: EquipmentModel) {
    const create = modelToEquipmentCreate(value);
    const equipment = await this.#equipmentService.insertOne(create);
    this.#listComponent.onReload();
    this.#initialValue.set(equipment);
    this.#navigate(['..', equipment._id]);
    return equipment;
  }

  async #updateEquipment(value: EquipmentModel, id: string) {
    const changes = computedChanges(value, this.#initialModel(), { includeNull: true });
    let equipment: Equipment;
    if (changes) {
      const update = modelToEquipmentUpdate(changes);
      equipment = await this.#equipmentService.updateOne(id, update);
    } else {
      equipment = await this.#equipmentService.getOne(id);
    }
    this.#initialValue.set(equipment);
    this.#listComponent.onReload();
    return equipment;
  }

  #validateName(schema: SchemaPath<string>): void {
    applyWhen(
      schema,
      ({ value }) => value() !== this.#initialModel().name,
      (s) => {
        this.#equipmentService.isNameAvailable(s);
      },
    );
  }
}
