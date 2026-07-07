import { Component, computed, effect, inject, input, linkedSignal, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { isEqual, pickBy } from 'lodash-es';
import { Material, MaterialCreate, MaterialPrice, MaterialUpdate } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { navigateRelative } from 'src/app/library/navigation';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { configuration } from 'src/app/services/config.provider';
import { MaterialsListComponent } from '../materials-list/materials-list.component';
import { MaterialsService } from '../services/materials.service';
import { MaterialsPricesComponent } from './materials-prices/materials-prices.component';
import { computedChanges } from 'src/app/library/signals';
import { firstValueFrom } from 'rxjs';
import {
  MaterialModel,
  materialToModel,
  modelToMaterialCreate,
  modelToMaterialUpdate,
} from '../schemas/material-model.schema';
import {
  applyEach,
  applyWhenValue,
  disabled,
  FieldTree,
  form,
  FormField,
  FormRoot,
  required,
  SchemaPath,
  validate,
  validateStandardSchema,
} from '@angular/forms/signals';
import { z } from 'zod';
import { updateCatching } from 'src/app/library/update-catching';
import { ExpressionInputDirective } from 'prd-cdk';
import { SimpleContentContainerComponent } from 'src/app/library/simple-form/simple-content-container/simple-content-container.component';

function validateNumeric(path: SchemaPath<string>) {
  validateStandardSchema(path, z.coerce.number().positive());
}

@Component({
  selector: 'app-materials-edit',
  templateUrl: './materials-edit.component.html',
  styleUrls: ['./materials-edit.component.scss'],
  imports: [
    SimpleContentContainerComponent,
    MaterialsPricesComponent,
    MatFormFieldModule,
    MatInput,
    MatCardModule,
    MatOptionModule,
    MatButton,
    MatSelectModule,
    MatCheckbox,
    ViewSizeDirective,
    FormField,
    ExpressionInputDirective,
    FormRoot,
  ],
})
export class MaterialsEditComponent implements CanComponentDeactivate {
  #materialsService = inject(MaterialsService);

  #listComppoent = inject(MaterialsListComponent);

  #navigate = navigateRelative();

  protected busy = signal(false);
  #update = updateCatching(this.busy);

  #units = configuration('jobs', 'productUnits');
  activeUnits = computed(() => this.#units().filter((unit) => !unit.disabled));

  protected categories = configuration('jobs', 'productCategories');

  materialInput = input.required<Material>({ alias: 'material' });
  #initialMaterial = linkedSignal(() => this.materialInput());
  #initialModel = linkedSignal(() => {
    return materialToModel(this.#initialMaterial());
  });
  #formModel = linkedSignal(() => this.#initialModel());

  constructor() {
    effect(() => {
      this.#initialMaterial();
      untracked(() => this.form().reset());
    });
  }

  protected isNew = computed(() => !this.materialInput()._id);

  protected form = form(
    this.#formModel,
    (schema) => {
      required(schema.name);
      disabled(schema.name, { when: () => this.isNew() === false });

      required(schema.units);
      required(schema.category);
      required(schema.fixedPrice);
      validateStandardSchema(schema.fixedPrice, z.coerce.number().min(0));
      applyEach(schema.prices, (p) => {
        required(p.min);
        validateNumeric(p.min);
        required(p.price);
        validateNumeric(p.price);
      });
      validateNumeric(schema.fixedPrice);
      this.#validateName(schema.name);
    },
    {
      submission: {
        action: async (f) => {
          const id = this.materialInput()._id;
          if (id) {
            await this.#updateMaterial(id, f);
          } else {
            await this.#createMaterial(f);
          }
        },
        ignoreValidators: 'none',
      },
    },
  );

  protected onReset() {
    this.form().reset(this.#initialModel());
  }

  canDeactivate(): boolean {
    return this.form().dirty() === false;
  }

  #validateName(path: SchemaPath<string>) {
    applyWhenValue(
      path,
      (value) => value !== this.#initialModel().name,
      (p) => this.#materialsService.isPropertyAvailable(p, 'name'),
    );
  }

  async #createMaterial(field: FieldTree<MaterialModel>) {
    await this.#update(async (message) => {
      const material = modelToMaterialCreate(field().value());
      const { _id: id } = await firstValueFrom(this.#materialsService.insertMaterial(material));
      this.#listComppoent.onReload();
      this.form().reset();
      await this.#navigate(['..', id]);
      message(`Materiāla veids izveidots`);
    });
  }

  async #updateMaterial(id: string, field: FieldTree<MaterialModel>) {
    await this.#update(async (message) => {
      const modelUpdate = computedChanges(field().value(), this.#initialModel(), { includeNull: true });
      if (!modelUpdate) return;
      const materialUpdate = modelToMaterialUpdate(modelUpdate);
      const updated = await firstValueFrom(this.#materialsService.updateMaterial(id, materialUpdate));
      this.#initialMaterial.set(updated);
      this.form().reset();
      message(`Izmaiņas saglabātas`);
    });
  }
}
