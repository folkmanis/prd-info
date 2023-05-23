import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import {
  ControlValueAccessor, FormArray, FormBuilder, FormControl, FormGroup,
  NG_VALIDATORS, NG_VALUE_ACCESSOR,
  ReactiveFormsModule, ValidationErrors, Validator, Validators
} from '@angular/forms';
import { JobProductionStageMaterial, Material } from 'src/app/interfaces';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { MaterialUnitsDirective } from './material-units.directive';
import { SelectDirective } from 'src/app/library/directives/select.directive';


type MaterialGroup = FormGroup<{
  [key in keyof JobProductionStageMaterial]: FormControl<JobProductionStageMaterial[key]>
}>;

@Component({
  selector: 'app-production-material',
  standalone: true,
  templateUrl: './production-material.component.html',
  styleUrls: ['./production-material.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MaterialLibraryModule,
    ReactiveFormsModule,
    MaterialUnitsDirective,
    SelectDirective,
  ],
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
    }
  ]
})
export class ProductionMaterialComponent implements ControlValueAccessor, Validator {

  materialsControl = new FormArray<MaterialGroup>([]);

  controls = signal(this.materialsControl.controls);

  private _materials: Material[] = [];
  @Input() set materials(value: Material[]) {
    if (Array.isArray(value)) {
      this._materials = value;
    }
  }
  get materials() {
    return this._materials;
  }

  trackByFn = (idx: number) => this.materialsControl.controls[idx];

  touchFn = () => { };

  constructor(
    private fb: FormBuilder,
  ) { }

  writeValue(obj: JobProductionStageMaterial[]): void {
    this.initControl(obj);
  }

  registerOnChange(fn: (obj: JobProductionStageMaterial[]) => void): void {
    this.materialsControl.valueChanges
      .subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.touchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.materialsControl.disable();
    } else {
      this.materialsControl.enable();
    }
  }

  validate(): ValidationErrors {
    if (this.materialsControl.valid) {
      return null;
    } else {
      return { materials: this.materialsControl.controls.filter(c => !c.valid).map(c => c.errors) };
    }
  }

  onNewMaterial() {
    this.materialsControl.push(this.materialGroup());
    this.controls.set(this.materialsControl.controls);
  }

  onDeleteMaterial(idx: number) {
    this.materialsControl.removeAt(idx);
    this.controls.set(this.materialsControl.controls);
  }

  private initControl(materials: JobProductionStageMaterial[]) {
    if (this.materialsControl.length === materials.length) {
      this.materialsControl.setValue(materials, { emitEvent: false });
    } else {
      this.materialsControl.clear({ emitEvent: false });
      materials.forEach(m => this.materialsControl.push(this.materialGroup(m), { emitEvent: false }));
      this.controls.set(this.materialsControl.controls);
    }
  }

  private materialGroup(material = new JobProductionStageMaterial()): MaterialGroup {
    return this.fb.group({
      materialId: [
        material.materialId,
        [Validators.required],
      ],
      amount: [
        material.amount,
        [Validators.required, Validators.min(0)]
      ],
      fixedAmount: [
        material.fixedAmount,
        [Validators.required, Validators.min(0)]
      ]
    });
  }

}

