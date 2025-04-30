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
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Material, newProductProductionStageMaterial, ProductProductionStageMaterial } from 'src/app/interfaces';
import { SelectDirective } from 'src/app/library/directives/select.directive';
import { MaterialUnitsDirective } from './material-units.directive';

type MaterialGroup = FormGroup<{
  [key in keyof ProductProductionStageMaterial]: FormControl<ProductProductionStageMaterial[key]>;
}>;

@Component({
  selector: 'app-production-material',
  templateUrl: './production-material.component.html',
  styleUrls: ['./production-material.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MaterialUnitsDirective, SelectDirective, MatIcon, MatButtonModule, MatTooltip],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ProductionMaterialComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ProductionMaterialComponent,
      multi: true,
    },
  ],
})
export class ProductionMaterialComponent implements ControlValueAccessor, Validator {
  form = new FormArray<MaterialGroup>([]);
  private fb = new FormBuilder().nonNullable;

  private chDetector = inject(ChangeDetectorRef);

  materials = input<Material[]>([]);

  trackByFn = (idx: number) => this.form.controls[idx];

  touchFn = () => {};

  writeValue(obj: ProductProductionStageMaterial[]): void {
    this.initControl(obj);
    this.chDetector.markForCheck();
  }

  registerOnChange(fn: (obj: ProductProductionStageMaterial[]) => void): void {
    this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.touchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }

  validate(): ValidationErrors | null {
    if (this.form.valid) {
      return null;
    } else {
      return {
        materials: this.form.controls.filter((c) => !c.valid).map((c) => c.errors),
      };
    }
  }

  onNewMaterial() {
    this.form.push(this.materialGroup());
    this.chDetector.markForCheck();
  }

  onDeleteMaterial(idx: number) {
    this.form.removeAt(idx);
    this.chDetector.markForCheck();
  }

  private initControl(materials: ProductProductionStageMaterial[]) {
    if (this.form.length === materials.length) {
      this.form.setValue(materials, { emitEvent: false });
    } else {
      this.form.clear({ emitEvent: false });
      materials.forEach((m) => this.form.push(this.materialGroup(m), { emitEvent: false }));
    }
  }

  private materialGroup(material = newProductProductionStageMaterial()): MaterialGroup {
    return this.fb.group({
      materialId: [material.materialId, [Validators.required]],
      amount: [material.amount, [Validators.required, Validators.min(0)]],
      fixedAmount: [material.fixedAmount, [Validators.required, Validators.min(0)]],
    });
  }
}
