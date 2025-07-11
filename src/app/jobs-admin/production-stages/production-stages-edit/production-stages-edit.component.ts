import { ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncValidatorFn, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEqual, pickBy } from 'lodash-es';
import { JobFilesService } from 'src/app/filesystem';
import { CreateProductionStage, DropFolder, ProductionStage, UpdateProductionStage } from 'src/app/interfaces';
import { notNullOrThrow } from 'src/app/library';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { navigateRelative } from 'src/app/library/navigation';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { CustomersService } from 'src/app/services';
import { ProductionStagesService } from 'src/app/services/production-stages.service';
import { EquipmentService } from '../../equipment/services/equipment.service';
import { DropFoldersComponent } from '../drop-folders/drop-folders.component';
import { ProductionStagesListComponent } from '../production-stages-list/production-stages-list.component';

@Component({
  selector: 'app-production-stages-edit',
  templateUrl: './production-stages-edit.component.html',
  styleUrls: ['./production-stages-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SimpleFormContainerComponent,
    ReactiveFormsModule,
    DropFoldersComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
  ],
})
export class ProductionStagesEditComponent implements CanComponentDeactivate {
  private productionStagesService = inject(ProductionStagesService);

  #jobFilesService = inject(JobFilesService);
  #snack = inject(MatSnackBar);
  #navigate = navigateRelative();
  #listComponent = inject(ProductionStagesListComponent);

  form = inject(FormBuilder).group({
    _id: [''],
    name: [
      '',
      {
        validators: [Validators.required],
        asyncValidators: [this.nameValidator()],
      },
    ],
    description: [null as string | null],
    equipmentIds: [[] as string[]],
    dropFolders: [[] as DropFolder[]],
  });

  equipment = inject(EquipmentService).getEquipmentResource().asReadonly();
  dropFolders = signal<{ value: string[]; name: string }[]>([]);

  customers = inject(CustomersService).getCustomersResource({ disabled: false }).asReadonly();

  productionStage = input.required<ProductionStage>();

  #initialValue = linkedSignal(() => this.productionStage());

  isNew = computed(() => !this.#initialValue()._id);

  #value = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  changes = computed(() => {
    const value = this.#value();
    if (this.isNew()) {
      return value;
    } else {
      const initial = this.#initialValue();
      const diff = pickBy(value, (v, key) => !isEqual(v, initial[key])) as Partial<ProductionStage>;
      return Object.keys(diff).length ? diff : null;
    }
  });

  constructor() {
    effect(() => {
      this.form.reset(this.#initialValue());
    });
    this.setDropFolderNames();
  }

  onReset(): void {
    this.form.reset(this.#initialValue());
  }

  async onUpdateStage() {
    const changes = notNullOrThrow(this.changes());
    const id = notNullOrThrow(this.#initialValue()._id);
    const result = await this.productionStagesService.updateOne(id, changes as UpdateProductionStage);
    this.#listComponent.onReload();
    this.#snack.open(`Atjaunots ${result.name}`, 'OK');
    this.#initialValue.set(result);
  }

  async onCreateStage() {
    const result = await this.productionStagesService.insertOne(this.form.getRawValue() as CreateProductionStage);
    this.form.markAsPristine();
    this.#listComponent.onReload();
    this.#snack.open(`Izveidots ${result.name}`, 'OK');
    this.#navigate(['..', result._id]);
  }

  canDeactivate(): boolean {
    return this.form.pristine || !this.changes();
  }

  private nameValidator(): AsyncValidatorFn {
    return async (control) => {
      const value: string = control.value;
      if (value === this.#initialValue().name) {
        return null;
      }
      return (await this.productionStagesService.validateName(value)) ? null : { occupied: value };
    };
  }

  private async setDropFolderNames() {
    const elements = await this.#jobFilesService.dropFolders();
    const folderNames = elements
      .filter((el) => el.isFolder)
      .map((el) => ({
        value: [...el.parent, el.name],
        name: [...el.parent, el.name].join('/'),
      }));
    this.dropFolders.set(folderNames);
  }
}
