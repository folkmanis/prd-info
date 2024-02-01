import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual, pickBy } from 'lodash-es';
import { map, of } from 'rxjs';
import { Material } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { getConfig } from 'src/app/services/config.provider';
import { MaterialsService } from '../services/materials.service';
import { MaterialsPricesComponent } from './materials-prices/materials-prices.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

type MaterialForm = {
  [k in keyof Material]-?: FormControl<Material[k]>;
};

@Component({
  selector: 'app-materials-edit',
  standalone: true,
  templateUrl: './materials-edit.component.html',
  styleUrls: ['./materials-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SimpleFormContainerComponent,
    FormsModule,
    ReactiveFormsModule,
    MaterialsPricesComponent,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatOptionModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
})
export class MaterialsEditComponent implements CanComponentDeactivate {
  units$ = getConfig('jobs', 'productUnits').pipe(
    map((units) => units.filter((unit) => !unit.disabled))
  );

  categories$ = getConfig('jobs', 'productCategories');

  form: FormGroup<MaterialForm> = this.fb.group({
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

  private _initialValue = new Material();
  get initialValue() {
    return this._initialValue;
  }
  set initialValue(value: Material) {
    this._initialValue = value;
    this.form.reset(this.initialValue);
  }

  private routerData = toSignal(this.route.data);

  private formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  changes = computed(() => {
    const value = this.formValue();
    const diff = pickBy(value, (v, key) => !isEqual(v, this.initialValue[key]));
    return Object.keys(diff).length ? diff : undefined;
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private materialsService: MaterialsService
  ) {
    effect(
      () => (this.initialValue = this.routerData().material || new Material()),
      { allowSignalWrites: true }
    );
  }

  onReset() {
    this.form.reset(this.initialValue);
  }

  onSave() {
    if (this.initialValue._id) {
      const update = { ...this.changes(), _id: this.initialValue._id };
      return this.materialsService
        .updateMaterial(update)
        .subscribe((material) => (this.initialValue = material));
    } else {
      return this.materialsService
        .insertMaterial(this.form.getRawValue())
        .subscribe((material) => {
          this.form.markAsPristine();
          this.router.navigate(['..', material._id], {
            relativeTo: this.route,
          });
        });
    }
  }

  canDeactivate(): boolean {
    return this.form.pristine;
  }

  private nameValidator(): AsyncValidatorFn {
    return (control: AbstractControl<string>) => {
      const nameCtrl = control.value.trim().toUpperCase();
      if (nameCtrl === this.initialValue.name?.toUpperCase()) {
        return of(null);
      }
      return this.materialsService.getNamesForValidation().pipe(
        map((names) => names.some((name) => name.toUpperCase() === nameCtrl)),
        map((invalid) => (invalid ? { occupied: nameCtrl } : null))
      );
    };
  }
}
