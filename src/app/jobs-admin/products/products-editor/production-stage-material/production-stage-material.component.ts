import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { JobProductionStageMaterial, Material } from 'src/app/interfaces';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { MaterialUnitsDirective } from './material-units.directive';


type MaterialGroup = ReturnType<typeof materialGroup>;

@Component({
  selector: 'app-production-stage-material',
  standalone: true,
  templateUrl: './production-stage-material.component.html',
  styleUrls: ['./production-stage-material.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MaterialLibraryModule,
    ReactiveFormsModule,
    MaterialUnitsDirective,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ProductionStageMaterialComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ProductionStageMaterialComponent,
      multi: true,
    }
  ]
})
export class ProductionStageMaterialComponent implements OnInit, ControlValueAccessor, Validator {

  @ViewChild(MatTable) private table: MatTable<MaterialGroup> | null;

  materialsControl = new FormArray<MaterialGroup>([]);

  private _materials: Material[] = [];
  @Input() set materials(value: Material[]) {
    if (Array.isArray(value)) {
      this._materials = value;
    }
  }
  get materials() {
    return this._materials;
  }

  displayedColumns = ['materialId', 'amount', 'fixedAmount', 'actions']; // 'units', 

  trackByFn = (idx: number) => this.materialsControl.controls[idx];

  touchFn = () => { };

  constructor(
  ) { }

  writeValue(obj: JobProductionStageMaterial[]): void {
    obj = obj instanceof Array ? obj : [];
    if (this.materialsControl.length === obj.length) {
      this.materialsControl.setValue(obj, { emitEvent: false });
    } else {
      this.materialsControl.clear({ emitEvent: false });
      obj.forEach(m => this.materialsControl.push(materialGroup(m), { emitEvent: false }));
      this.table?.renderRows();
    }
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

  validate(control: AbstractControl<any, any>): ValidationErrors {
    if (this.materialsControl.valid) {
      return null;
    } else {
      return { materials: this.materialsControl.controls.filter(c => !c.valid).map(c => c.errors) };
    }
  }

  ngOnInit(): void {
  }

  onNewMaterial() {
    this.materialsControl.push(materialGroup());
    this.table?.renderRows();
  }

  onDeleteMaterial(idx: number) {
    this.materialsControl.removeAt(idx);
    this.table?.renderRows();
  }

}

function materialGroup(material?: JobProductionStageMaterial) {
  return new FormGroup({
    materialId: new FormControl<string>(
      material?.materialId,
      [Validators.required],
    ),
    amount: new FormControl<number>(
      material?.amount || 0,
      [Validators.required, Validators.min(0)]
    ),
    fixedAmount: new FormControl<number>(
      material?.fixedAmount || 0,
      [Validators.required, Validators.min(0)]
    )
  });
}

