import { ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncValidatorFn, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEqual, pickBy } from 'lodash-es';
import { JobFilesService } from 'src/app/filesystem';
import { ProductionStage } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { navigateRelative } from 'src/app/library/navigation';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { CustomersService } from 'src/app/services';
import { ProductionStagesService } from 'src/app/services/production-stages.service';
import { EquipmentService } from '../../equipment/services/equipment.service';
import { DropFoldersComponent } from '../drop-folders/drop-folders.component';

type ProductionStageControl = {
  [key in keyof Required<ProductionStage>]: FormControl<ProductionStage[key]>;
};

@Component({
  selector: 'app-production-stages-edit',
  templateUrl: './production-stages-edit.component.html',
  styleUrls: ['./production-stages-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SimpleFormContainerComponent,
    ReactiveFormsModule,
    FormsModule,
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
  private readonly equipmentService = inject(EquipmentService);
  private readonly jobFilesService = inject(JobFilesService);
  private readonly customersService = inject(CustomersService);
  private readonly snack = inject(MatSnackBar);
  private readonly navigate = navigateRelative();

  form: FormGroup<ProductionStageControl> = inject(FormBuilder).group({
    _id: [''],
    name: [
      '',
      {
        validators: [Validators.required],
        asyncValidators: [this.nameValidator()],
      },
    ],
    description: [null],
    equipmentIds: [],
    dropFolders: [],
  });

  equipment = this.equipmentService.equipment;
  dropFolders = signal<{ value: string[]; name: string }[]>([]);

  customers = this.customersService.customers;

  productionStage = input.required<ProductionStage>();

  private initialValue = linkedSignal(() => this.productionStage());

  isNew = computed(() => !this.initialValue()._id);

  private value = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  changes = computed(() => {
    const value = this.value();
    if (this.isNew()) {
      return value;
    } else {
      const initial = this.initialValue();
      const diff = pickBy(value, (v, key) => !isEqual(v, initial[key]));
      return Object.keys(diff).length ? diff : null;
    }
  });

  constructor(private productionStagesService: ProductionStagesService) {
    this.equipmentService.filter.set({});
    effect(() => {
      this.form.reset(this.initialValue());
    });
    this.setDropFolderNames();
    this.customersService.setFilter({ disabled: false });
  }

  onReset(): void {
    this.form.reset(this.initialValue());
  }

  async onUpdateStage() {
    const update = { ...this.changes(), _id: this.initialValue()._id };
    const result = await this.productionStagesService.updateOne(update);
    this.snack.open(`Atjaunots ${result.name}`, 'OK');
    this.initialValue.set(result);
  }

  async onCreateStage() {
    const result = await this.productionStagesService.insertOne(this.form.getRawValue());
    this.form.markAsPristine();
    this.snack.open(`Izveidots ${result.name}`, 'OK');
    this.navigate(['..', result._id]);
  }

  canDeactivate(): boolean {
    return this.form.pristine || !this.changes();
  }

  private nameValidator(): AsyncValidatorFn {
    return async (control) => {
      const value: string = control.value;
      if (value === this.initialValue().name) {
        return null;
      }
      return (await this.productionStagesService.validateName(value)) ? null : { occupied: value };
    };
  }

  private async setDropFolderNames() {
    const elements = await this.jobFilesService.dropFolders();
    const folderNames = elements
      .filter((el) => el.isFolder)
      .map((el) => ({
        value: [...el.parent, el.name],
        name: [...el.parent, el.name].join('/'),
      }));
    this.dropFolders.set(folderNames);
  }
}
