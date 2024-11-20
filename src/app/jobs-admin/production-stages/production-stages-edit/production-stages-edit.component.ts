import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncValidatorFn, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual, pickBy } from 'lodash-es';
import { map, of } from 'rxjs';
import { CustomerPartial, EquipmentPartial, ProductionStage } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { ProductionStagesService } from 'src/app/services/production-stages.service';
import { DropFoldersComponent } from '../drop-folders/drop-folders.component';
import { MatSelectModule } from '@angular/material/select';

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
    ]
})
export class ProductionStagesEditComponent implements CanComponentDeactivate {
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

  private data = toSignal(this.route.data);

  equipment = computed(() => this.data().equipment as EquipmentPartial[]);
  dropFolders = computed(() => this.data().dropFolders as { value: string[]; name: string }[]);
  customers = computed(() => this.data().customers as CustomerPartial[]);

  private initialValue = new ProductionStage();

  private get isNew() {
    return !this.initialValue._id;
  }

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
      const diff = pickBy(value, (v, key) => !isEqual(v, this.initialValue[key]));
      return Object.keys(diff).length ? diff : undefined;
    }
  });

  constructor(
    private productionStagesService: ProductionStagesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    effect(
      () => {
        const stage = this.data().productionStage || new ProductionStage();
        this.setInitialValue(stage);
      },
      { allowSignalWrites: true },
    );
  }

  onReset(): void {
    this.form.reset(this.initialValue);
  }

  onSave(): void {
    if (this.isNew) {
      this.productionStagesService.insertOne(this.form.getRawValue()).subscribe((stage) => {
        this.form.markAsPristine();
        this.router.navigate(['..', stage._id], { relativeTo: this.route });
      });
    } else {
      const update = { ...this.changes(), _id: this.initialValue._id };
      this.productionStagesService.updateOne(update).subscribe((stage) => this.setInitialValue(stage));
    }
  }

  canDeactivate(): boolean {
    return this.form.pristine || !this.changes();
  }

  private setInitialValue(stage: ProductionStage) {
    this.initialValue = stage;
    this.form.reset(this.initialValue);
  }

  private nameValidator(): AsyncValidatorFn {
    return (control) => {
      const nameCtrl: string = (control.value as string).trim().toUpperCase();
      if (nameCtrl === this.initialValue.name?.toUpperCase()) {
        return of(null);
      }
      return this.productionStagesService.names().pipe(
        map((names) => names.some((name) => name.toUpperCase() === nameCtrl)),
        map((invalid) => (invalid ? { occupied: nameCtrl } : null)),
      );
    };
  }
}
