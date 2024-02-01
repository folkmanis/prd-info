import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual, pickBy } from 'lodash-es';
import { map, of } from 'rxjs';
import { Equipment } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { EquipmentService } from '../services/equipment.service';

type EquipmentForm = FormGroup<{
  [key in keyof Equipment]: FormControl<Equipment[key]>;
}>;

@Component({
  selector: 'app-equipment-edit',
  standalone: true,
  templateUrl: './equipment-edit.component.html',
  styleUrls: ['./equipment-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SimpleFormContainerComponent,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
})
export class EquipmentEditComponent implements CanComponentDeactivate {
  form: EquipmentForm = this.fb.group({
    _id: [null],
    name: [
      '',
      {
        validators: [Validators.required],
        asyncValidators: [this.nameValidator()],
      },
    ],
    description: [''],
  });

  private _initialValue = new Equipment();
  set initialValue(value: Equipment) {
    this._initialValue = value;
    this.form.reset(this.initialValue);
  }
  get initialValue() {
    return this._initialValue;
  }

  private get isNew() {
    return !this.initialValue._id;
  }

  private routerData = toSignal(this.route.data);

  private value = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  changes = computed(() => {
    const value = this.value();
    if (this.isNew) {
      return value;
    } else {
      const diff = pickBy(
        value,
        (v, key) => !isEqual(v, this.initialValue[key])
      );
      return Object.keys(diff).length ? diff : undefined;
    }
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private equipmentService: EquipmentService,
    private fb: FormBuilder
  ) {
    effect(
      () =>
        (this.initialValue = this.routerData().equipment || new Equipment()),
      { allowSignalWrites: true }
    );
  }

  onReset() {
    this.form.reset(this.initialValue);
  }

  onSave() {
    if (this.isNew) {
      return this.equipmentService
        .insertOne(this.form.getRawValue())
        .subscribe((equipment) => {
          this.form.markAsPristine();
          this.router.navigate(['..', equipment._id], {
            relativeTo: this.route,
          });
        });
    } else {
      const update = { ...this.changes(), _id: this.initialValue._id };
      return this.equipmentService
        .updateOne(update)
        .subscribe((equipment) => (this.initialValue = equipment));
    }
  }

  canDeactivate(): boolean {
    return this.form.pristine;
  }

  private nameValidator(): AsyncValidatorFn {
    return (control) => {
      const name = (control.value as string).trim().toUpperCase();
      if (name === this.initialValue.name.toUpperCase()) {
        return of(null);
      }
      return this.equipmentService.names().pipe(
        map((names) => names.map((n) => n.toUpperCase()).includes(name)),
        map((invalid) => (invalid ? { occupied: name } : null))
      );
    };
  }
}
