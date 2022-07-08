import { ViewChild, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup, UntypedFormControl, Validators, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { JobProductionStageMaterial } from 'src/app/interfaces';
import { MaterialsService } from 'src/app/jobs-admin/materials/services/materials.service';
import { MatTable } from '@angular/material/table';
// import { MaterialGroup } from '../../services/products-form-source';

type MaterialGroup = ReturnType<typeof materialGroup>;

@Component({
  selector: 'app-production-stage-material',
  templateUrl: './production-stage-material.component.html',
  styleUrls: ['./production-stage-material.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  materials$ = this.materialsService.materials$;

  displayedColumns = ['materialId', 'amount', 'fixedAmount', 'actions']; // 'units', 

  trackByFn = (idx: number) => this.materialsControl.controls[idx];

  touchFn = () => { };

  constructor(
    private materialsService: MaterialsService,
  ) { }

  writeValue(obj: JobProductionStageMaterial[]): void {
    obj = obj instanceof Array ? obj : [];
    console.log(obj);
    if (this.materialsControl.length === obj.length) {
      this.materialsControl.setValue(obj, { emitEvent: false });
    } else {
      this.materialsControl.clear({ emitEvent: false });
      obj.forEach(m => this.materialsControl.push(materialGroup(m), { emitEvent: false }));
      console.log(this.materialsControl);
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
    this.materialsService.setFilter(null);
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

