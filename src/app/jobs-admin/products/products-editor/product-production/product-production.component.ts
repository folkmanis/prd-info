import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { JobProductionStage, Material, ProductionStage } from 'src/app/interfaces';
import { SelectDirective } from 'src/app/library/directives/select.directive';
import { ProductionMaterialComponent } from './production-material/production-material.component';

type JobProductionStageControlType = FormGroup<{
  [key in keyof JobProductionStage]: FormControl<JobProductionStage[key]>;
}>;

@Component({
  selector: 'app-product-production',
  templateUrl: './product-production.component.html',
  styleUrls: ['./product-production.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ProductionMaterialComponent, SelectDirective, MatDividerModule, MatCardModule, MatIconModule, MatButtonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ProductProductionComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ProductProductionComponent,
      multi: true,
    },
  ],
})
export class ProductProductionComponent implements ControlValueAccessor, Validator {
  private chDetector = inject(ChangeDetectorRef);

  private fb = new FormBuilder();

  form = new FormArray<JobProductionStageControlType>([]);

  materials = input<Material[]>([]);
  productionStages = input<ProductionStage[]>([]);

  onTouched: () => void = () => {};

  writeValue(obj: JobProductionStage[]): void {
    this.setProductionStages(obj);
  }

  registerOnChange(fn: (value: Partial<JobProductionStage>[]) => void): void {
    this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }

  validate(): ValidationErrors {
    if (this.form.valid) {
      return null;
    } else {
      return {
        materials: this.form.controls.filter((control) => !control.valid).map((controls) => controls.errors),
      };
    }
  }

  onDeleteStage(idx: number) {
    this.form.removeAt(idx);
    this.chDetector.markForCheck();
  }

  onNewProductionStage(): void {
    this.form.push(this.stageControl());
    this.chDetector.markForCheck();
  }

  private setProductionStages(stages?: JobProductionStage[]): void {
    stages = stages instanceof Array ? stages : [];

    if (stages.length === this.form.length) {
      this.form.patchValue(stages);
    } else {
      this.form.clear({ emitEvent: false });
      stages.forEach((st) => this.form.push(this.stageControl(st), { emitEvent: false }));
      this.chDetector.markForCheck();
    }
  }

  private stageControl(stage: JobProductionStage = new JobProductionStage()): JobProductionStageControlType {
    return this.fb.nonNullable.group({
      productionStageId: [stage.productionStageId, [Validators.required]],
      amount: [stage.amount],
      fixedAmount: [stage.fixedAmount],
      materials: [stage.materials],
    });
  }
}
