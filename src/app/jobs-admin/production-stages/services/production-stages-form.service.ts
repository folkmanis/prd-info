import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClassTransformer } from 'class-transformer';
import { of, map, Observable, tap } from 'rxjs';
import { ProductionStagesService } from 'src/app/services/production-stages.service';
import { CreateProductionStage, ProductionStage, DropFolder } from 'src/app/interfaces';
import { isEqual, pickBy } from 'lodash';


@Injectable()
export class ProductionStagesFormService {


  form = this.createForm();

  private initialValue: ProductionStage | null = null;

  updateChanges = this.form.valueChanges.pipe(
    map(() => this.changes),
  );

  get isNew(): boolean {
    return !this.initialValue?._id;
  }

  get value() {
    return this.transformer.plainToInstance(ProductionStage, this.form.value, { exposeDefaultValues: true });
  }


  get changes(): Partial<ProductionStage> | undefined {
    if (this.isNew) {
      return pickBy(this.value, value => value !== null);
    } else {
      const diff = pickBy(this.value, (value, key) => !isEqual(value, this.initialValue[key]));
      return Object.keys(diff).length ? diff : undefined;
    }
  }



  constructor(
    private productionStagesService: ProductionStagesService,
    private transformer: ClassTransformer,
  ) { }


  setInitial(value: ProductionStage | null) {
    if (value._id) {
      this.initialValue = value;
    } else {
      this.initialValue = new ProductionStage();
    }
    this.form.reset(this.initialValue);
  }

  reset(): void {
    this.form.reset(this.initialValue);
  }

  save(): Observable<ProductionStage> {
    if (this.isNew) {
      const production = pickBy(this.value, value => value !== null) as CreateProductionStage;
      return this.productionStagesService.insertOne(production).pipe(
        tap(() => this.form.markAsPristine()),
      );
    } else {
      const update = { ...this.changes, _id: this.value._id };
      return this.productionStagesService.updateOne(update).pipe(
        tap(value => this.setInitial(value)),
      );
    }
  }


  private createForm() {
    return new FormGroup({
      _id: new FormControl<string>(undefined),
      name: new FormControl<string>(
        '',
        {
          validators: [Validators.required],
          asyncValidators: [this.nameValidator()],
        }
      ),
      description: new FormControl<string>(null),
      equipmentIds: new FormControl<string[]>([]),
      dropFolders: new FormControl<DropFolder[]>([]),
    });
  }

  private nameValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const nameCtrl: string = (control.value as string).trim().toUpperCase();
      if (nameCtrl === this.initialValue.name?.toUpperCase()) {
        return of(null);
      }
      return this.productionStagesService.names().pipe(
        map(names => names.some(name => name.toUpperCase() === nameCtrl)),
        map(invalid => invalid ? { occupied: nameCtrl } : null)
      );
    };
  }



}
