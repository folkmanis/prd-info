import { Component, computed, inject, linkedSignal, model, signal } from '@angular/core';
import {
  applyEach,
  applyWhen,
  debounce,
  disabled,
  FieldTree,
  form,
  FormField,
  FormRoot,
  minLength,
  required,
  SchemaPath,
  SchemaPathTree,
  TreeValidationResult,
  validateTree,
} from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { JobFilesService } from 'src/app/filesystem';
import { EquipmentList, ProductionStage } from 'src/app/interfaces';
import {
  newProductionStage,
  ProductionStagesService,
} from 'src/app/jobs-admin/production-stages/services/production-stages.service';
import { trimValidator } from 'src/app/library';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { navigateRelative } from 'src/app/library/navigation';
import { computedChanges } from 'src/app/library/signals';
import { SimpleContentContainerComponent } from 'src/app/library/simple-form/simple-content-container/simple-content-container.component';
import { updateCatching } from 'src/app/library/update-catching';
import { CustomersService } from 'src/app/services';
import { EquipmentService } from '../../equipment/services/equipment.service';
import { DropFoldersComponent } from '../drop-folders/drop-folders.component';
import { ProductionStagesListComponent } from '../production-stages-list/production-stages-list.component';
import {
  modelToProductionStageCreate,
  modelToProductionStageUpdate,
  ProductionStageModel,
  productionStageToModel,
} from './production-stage-edit.model';

const NAME_MIN_LENGTH = 3;

function validateNoDuplicateDropfolderPath(schema: SchemaPathTree<ProductionStageModel['dropFolders']>) {
  validateTree(schema, ({ value, fieldTree }) => {
    const dropFolders = value().map((val, idx) => ({
      path: val.path.join('/'),
      ft: fieldTree[idx].path,
    }));
    const counts = new Map<string, number>();
    for (const { path } of dropFolders) {
      if (path) {
        counts.set(path, (counts.get(path) ?? 0) + 1);
      }
    }
    const errors: TreeValidationResult = dropFolders
      .filter(({ path }) => path && (counts.get(path) ?? 0) > 1)
      .map(({ ft }) => ({
        kind: 'duplicateFolder',
        message: `Atkārtojas`,
        fieldTree: ft,
      }));
    return errors.length > 0 ? errors : null;
  });
}

function validateNoDuplicateDefaultDropFolder(schema: SchemaPathTree<ProductionStageModel['dropFolders']>) {
  validateTree(schema, ({ value, fieldTree }) => {
    const defaults = value()
      .map((val, idx) => ({ customers: val.customers, ft: fieldTree[idx].customers }))
      .filter(({ customers }) => customers.includes('**'));
    return defaults.length > 1
      ? defaults.map(({ ft }) => ({
          kind: 'duplicateDefaults',
          message: `Viena noklusējuma vērtība`,
          fieldTree: ft,
        }))
      : null;
  });
}

@Component({
  selector: 'app-production-stages-edit',
  templateUrl: './production-stages-edit.component.html',
  styleUrls: ['./production-stages-edit.component.scss'],
  imports: [
    SimpleContentContainerComponent,
    FormField,
    FormRoot,
    DropFoldersComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    MatOption,
    MatSelect,
    MatProgressSpinner,
    MatCheckbox,
  ],
})
export class ProductionStagesEditComponent implements CanComponentDeactivate {
  #productionStagesService = inject(ProductionStagesService);
  #navigate = navigateRelative();
  #listComponent = inject(ProductionStagesListComponent);

  protected busy = signal(false);
  #update = updateCatching(this.busy);

  protected equipment = inject(EquipmentService).getEquipmentResource({ disabled: true }).asReadonly();
  protected customers = inject(CustomersService).getCustomersResource({ disabled: false }).asReadonly();
  protected dropFolders = inject(JobFilesService).dropFoldersResource().asReadonly();

  productionStage = model<ProductionStage>(newProductionStage());
  #initialModel = linkedSignal(() => {
    const m = productionStageToModel(this.productionStage());
    this.form().reset();
    return m;
  });
  #formModel = linkedSignal<ProductionStageModel>(() => productionStageToModel(this.productionStage()));

  protected isNew = computed(() => !this.productionStage()._id);

  protected form = form(
    this.#formModel,
    (schema) => {
      disabled(schema, { when: () => this.busy() });

      required(schema.name);
      trimValidator(schema.name);
      minLength(schema.name, NAME_MIN_LENGTH, { message: `Nosaukumam jābūt vismaz ${NAME_MIN_LENGTH} zīmes garam` });
      this.#validateName(schema.name);
      debounce(schema.name, 300);

      applyEach(schema.equipmentIds, (s) => {
        required(s);
      });

      applyEach(schema.dropFolders, (s) => {
        required(s.customers, { message: `Jānorāda obligāti` });
        required(s.path, { message: `Jānorāda obligāti` });
        minLength(s.customers, 1, { message: `Jānorāda vismaz viens` });
        minLength(s.path, 1, { message: `Jānorāda obligāti` });
      });
      validateNoDuplicateDefaultDropFolder(schema.dropFolders);
      validateNoDuplicateDropfolderPath(schema.dropFolders);
    },
    {
      submission: {
        ignoreValidators: 'none',
        action: async (tree) => {
          await this.#saveProductionStage(tree);
        },
      },
    },
  );

  constructor() {
    // effect(() => {
    //   this.productionStage();
    //   untracked(() => {
    //     this.form().reset();
    //   });
    // });
  }

  canDeactivate = () => this.form().dirty() === false;

  protected findEquipment = (id: string, eqs: EquipmentList[]) => eqs.find((eq) => eq._id === id);

  protected onReset() {
    this.form().reset(productionStageToModel(this.productionStage()));
  }

  protected onEquipmentSelect({ value }: MatSelectChange<string[]>) {
    if (value.length === 0) {
      this.#formModel.update((m) => ({ ...m, defaultEquipmentId: null }));
      return;
    }
    if (value.length === 1 && this.#formModel().defaultEquipmentId !== value[0]) {
      const defaultEquipmentId = value[0] as string;
      this.#formModel.update((m) => ({ ...m, defaultEquipmentId }));
      return;
    }
    const defaultEquipmentId = this.#formModel().defaultEquipmentId;
    if (typeof defaultEquipmentId === 'string' && value.includes(defaultEquipmentId) === false) {
      this.#formModel.update((m) => ({ ...m, defaultEquipmentId: null }));
    }
  }

  #saveProductionStage(tree: FieldTree<ProductionStageModel>) {
    return this.#update(async (message) => {
      const id = this.productionStage()._id;
      if (id) {
        await this.#updateProductionStage(id, tree().value());
        message(`Izmaiņas saglabātas`);
      } else {
        const productionStage = await this.#createProductionStage(tree().value());
        message(`Process ${productionStage.name} izveidots`);
      }
    });
  }

  async #createProductionStage(value: ProductionStageModel): Promise<ProductionStage> {
    const create = modelToProductionStageCreate(value);
    const productionStage = await this.#productionStagesService.insertOne(create);
    this.#listComponent.onReload();
    this.productionStage.set(productionStage);
    this.#navigate(['..', productionStage._id]);
    return productionStage;
  }

  async #updateProductionStage(id: string, value: ProductionStageModel): Promise<ProductionStage | null> {
    const changes = computedChanges(value, productionStageToModel(this.productionStage()), { includeNull: true });
    if (changes) {
      const update = modelToProductionStageUpdate(changes);
      const productionStage = await this.#productionStagesService.updateOne(id, update);
      this.productionStage.set(productionStage);
      this.#listComponent.onReload();
      return productionStage;
    } else {
      return null;
    }
  }

  #validateName(schema: SchemaPath<string>): void {
    applyWhen(
      schema,
      ({ value }) => value() !== this.#initialModel().name,
      (s) => {
        this.#productionStagesService.validateName(s);
      },
    );
  }
}
