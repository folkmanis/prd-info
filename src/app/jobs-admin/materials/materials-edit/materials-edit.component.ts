import { Component, computed, effect, inject, input, linkedSignal, untracked } from '@angular/core';
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
} from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ExpressionInputDirective } from 'prd-cdk';
import { firstValueFrom } from 'rxjs';
import { Material } from 'src/app/interfaces';
import { positiveNumericString } from 'src/app/library';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { navigateRelative } from 'src/app/library/navigation';
import { computedChanges } from 'src/app/library/signals';
import { SimpleContentContainerComponent } from 'src/app/library/simple-form/simple-content-container/simple-content-container.component';
import { updateCatching } from 'src/app/library/update-catching';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { configuration } from 'src/app/services/config.provider';
import { MaterialsListComponent } from '../materials-list/materials-list.component';
import {
  MaterialModel,
  materialToModel,
  modelToMaterialCreate,
  modelToMaterialUpdate,
} from '../schemas/material-model.schema';
import { MaterialsService } from '../services/materials.service';
import { MaterialsPricesComponent } from './materials-prices/materials-prices.component';
import { materialPrice, materialPrices } from './materials-prices/validate-materials-price';

@Component({
  selector: 'app-materials-edit',
  templateUrl: './materials-edit.component.html',
  styleUrls: ['./materials-edit.component.scss'],
  imports: [
    FormRoot,
    FormField,
    SimpleContentContainerComponent,
    ViewSizeDirective,
    MaterialsPricesComponent,
    MatFormFieldModule,
    MatInput,
    MatCardModule,
    MatOptionModule,
    MatButton,
    MatSelectModule,
    MatCheckbox,
    ExpressionInputDirective,
  ],
})
export class MaterialsEditComponent implements CanComponentDeactivate {
  #materialsService = inject(MaterialsService);

  #listComponent = inject(MaterialsListComponent);

  #navigate = navigateRelative();

  #update = updateCatching();

  #units = configuration('jobs', 'productUnits');
  protected activeUnits = computed(() => this.#units().filter((unit) => !unit.disabled));
  protected categories = configuration('jobs', 'productCategories');

  materialInput = input.required<Material>({ alias: 'material' });
  #initialMaterial = linkedSignal(() => this.materialInput());
  #initialModel = linkedSignal(() => materialToModel(this.#initialMaterial()));
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
      applyEach(schema.prices, (p) => {
        materialPrice(p);
      });
      positiveNumericString(schema.fixedPrice);
      this.#validateName(schema.name);
      materialPrices(schema.prices);
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
          this.#listComponent.onReload();
        },
        ignoreValidators: 'none',
      },
    },
  );

  protected onReset() {
    this.form().reset(materialToModel(this.#initialMaterial()));
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
      this.form().reset();
      await this.#navigate(['..', id]);
      message(`Materiāla veids izveidots`);
    });
  }

  async #updateMaterial(id: string, field: FieldTree<MaterialModel>) {
    await this.#update(async (message) => {
      const modelUpdate = computedChanges(field().value(), this.#initialModel(), { includeNull: true });
      if (modelUpdate) {
        const materialUpdate = modelToMaterialUpdate(modelUpdate);
        const updated = await firstValueFrom(this.#materialsService.updateMaterial(id, materialUpdate));
        this.#initialMaterial.set(updated);
        message(`Izmaiņas saglabātas`);
      }
      this.form().reset();
    });
  }
}
