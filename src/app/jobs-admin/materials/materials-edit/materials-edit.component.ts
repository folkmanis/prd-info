import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { isEqual, pickBy } from 'lodash-es';
import { Material } from 'src/app/interfaces';
import { navigateRelative } from 'src/app/library/navigation';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { configuration } from 'src/app/services/config.provider';
import { MaterialsService } from '../services/materials.service';
import { MaterialsPricesComponent } from './materials-prices/materials-prices.component';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { MaterialsListComponent } from '../materials-list/materials-list.component';

type MaterialForm = {
  [k in keyof Material]-?: FormControl<Material[k]>;
};

@Component({
  selector: 'app-materials-edit',
  templateUrl: './materials-edit.component.html',
  styleUrls: ['./materials-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SimpleFormContainerComponent,
    FormsModule,
    ReactiveFormsModule,
    MaterialsPricesComponent,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatOptionModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    ViewSizeDirective,
  ],
})
export class MaterialsEditComponent implements CanComponentDeactivate {
  #materialsService = inject(MaterialsService);

  #listComppoent = inject(MaterialsListComponent);

  #navigate = navigateRelative();

  #units = configuration('jobs', 'productUnits');
  activeUnits = computed(() => this.#units().filter((unit) => !unit.disabled));

  categories = configuration('jobs', 'productCategories');

  form: FormGroup<MaterialForm> = inject(FormBuilder).group({
    _id: [''],
    name: [
      '',
      {
        validators: [Validators.required],
        asyncValidators: [this.nameValidator()],
      },
    ],
    description: [''],
    units: ['', [Validators.required]],
    category: ['', [Validators.required]],
    inactive: [false],
    prices: [],
    fixedPrice: [0],
  });

  material = input.required<Material>();

  private formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  changes = computed(() => {
    const value = this.formValue();
    const initialValue = this.material();
    const diff = pickBy(value, (v, key) => !isEqual(v, initialValue[key]));
    return Object.keys(diff).length ? diff : undefined;
  });

  constructor() {
    effect(() => this.form.reset(this.material()));
  }

  onReset() {
    this.form.reset(this.material());
  }

  async onSave() {
    let id = this.material()._id;
    if (id) {
      const update = { ...this.changes(), _id: id };
      await this.#materialsService.updateMaterial(update);
    } else {
      const { _id, ...newMaterial } = this.form.getRawValue();
      const created = await this.#materialsService.insertMaterial(newMaterial);
      id = created._id;
    }
    this.#listComppoent.onReload();
    this.form.markAsPristine();
    await this.#navigate(['..', id], { queryParams: { upd: Date.now() } });
  }

  canDeactivate(): boolean {
    return this.form.pristine;
  }

  private nameValidator(): AsyncValidatorFn {
    return async (control: AbstractControl<string>) => {
      const nameCtrl = control.value.trim().toUpperCase();
      const initialName = this.material().name.toUpperCase();
      if (nameCtrl === initialName) {
        return null;
      }
      const names = await this.#materialsService.getNamesForValidation();
      return names.every((name) => name.toUpperCase() !== nameCtrl) ? null : { occupied: nameCtrl };
    };
  }
}
