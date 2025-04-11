import { ChangeDetectionStrategy, Component, computed, effect, inject, model } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEqual, pickBy } from 'lodash-es';
import { Equipment } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { navigateRelative } from 'src/app/library/navigation';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { EquipmentService } from '../services/equipment.service';
import { EquipmentListComponent } from '../equipment-list/equipment-list.component';

type EquipmentForm = FormGroup<{
  [key in keyof Equipment]: FormControl<Equipment[key] | null>;
}>;

@Component({
  selector: 'app-equipment-edit',
  templateUrl: './equipment-edit.component.html',
  styleUrls: ['./equipment-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SimpleFormContainerComponent, MatFormFieldModule, MatInputModule, MatCardModule],
})
export class EquipmentEditComponent implements CanComponentDeactivate {
  private equipmentService = inject(EquipmentService);
  private snack = inject(MatSnackBar);

  private navigate = navigateRelative();

  private listComponent = inject(EquipmentListComponent);

  form: EquipmentForm = inject(FormBuilder).group({
    _id: [null as string | null],
    name: [
      '',
      {
        validators: [Validators.required],
        asyncValidators: [this.nameValidator()],
      },
    ],
    description: [''],
  });

  initialValue = model.required<Equipment>({ alias: 'equipment' });

  isNew = computed(() => !this.initialValue()._id);

  value = toSignal(this.form.valueChanges, {
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
      const diff = pickBy(value, (v, key) => !isEqual(v, this.initialValue()[key]));
      return Object.keys(diff).length ? diff : null;
    }
  });

  constructor() {
    effect(() => {
      this.form.reset(this.initialValue());
    });
  }

  onReset() {
    this.form.reset(this.initialValue());
  }

  async onSave() {
    if (this.isNew()) {
      this.onCreateEquipment();
    } else {
      this.onUpdateEquipment();
    }
  }

  private async onCreateEquipment() {
    const created = await this.equipmentService.insertOne(this.form.getRawValue() as Omit<Equipment, '_id'>);
    this.snack.open(`${created.name} izveidots`, 'OK');
    this.listComponent.onReload();
    this.form.markAsPristine();
    this.navigate(['..', created._id]);
  }

  private async onUpdateEquipment() {
    const update = { ...this.changes(), _id: this.initialValue()._id };
    const updated = await this.equipmentService.updateOne(update as Pick<Equipment, '_id'> & Partial<Equipment>);
    this.initialValue.set(updated);
    this.listComponent.onReload();
    this.snack.open(`${updated.name} atjaunināts`, 'OK');
  }

  canDeactivate = () => this.form.pristine || this.changes() === null;

  private nameValidator(): AsyncValidatorFn {
    return async (control) => {
      if (control.value === this.initialValue().name) {
        return null;
      }
      try {
        const name = (control.value as string).trim().toUpperCase();
        return (await this.equipmentService.validateName(name)) ? null : { occupied: name };
      } catch (error) {
        return { checkFailed: error.message };
      }
    };
  }
}
