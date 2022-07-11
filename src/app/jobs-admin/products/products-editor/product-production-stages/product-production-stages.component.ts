import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { JobProductionStage, JobProductionStageMaterial } from 'src/app/interfaces';
import { ProductionStagesService } from 'src/app/services/production-stages.service';

type ProductionStageGroup = ReturnType<typeof productionStage>;

@Component({
  selector: 'app-product-production-stages',
  templateUrl: './product-production-stages.component.html',
  styleUrls: ['./product-production-stages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ProductProductionStagesComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ProductProductionStagesComponent,
      multi: true,
    }
  ]
})
export class ProductProductionStagesComponent implements OnInit, ControlValueAccessor, Validator {

  @ViewChild(MatTable) private table: MatTable<ProductionStageGroup> | null;

  productionStages = new FormArray<ProductionStageGroup>([]);


  displayedColumns = ['expand', 'productionStageId', 'amount', 'fixedAmount', 'actions'];

  stagesAvailable$ = this.productionStagesService.productionStages$;

  expanded: ProductionStageGroup | null = null;

  whenFn = (idx: number, rowData: ProductionStageGroup): boolean => rowData === this.expanded;

  touchFn = () => { };

  constructor(
    private productionStagesService: ProductionStagesService,
  ) { }

  writeValue(obj: JobProductionStage[]): void {
    obj = obj instanceof Array ? obj : [];
    if (obj.length === this.productionStages.length) {
      this.productionStages.setValue(obj, { emitEvent: false });
    } else {
      this.productionStages.clear({ emitEvent: false });
      obj.forEach(st => this.productionStages.push(productionStage(st), { emitEvent: false }));
      this.table?.renderRows();
    }
  }

  registerOnChange(fn: (st: JobProductionStage[]) => void): void {
    this.productionStages.valueChanges
      .subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.touchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.productionStages.disable();
    } else {
      this.productionStages.enable();
    }
  }

  validate(): ValidationErrors {
    if (this.productionStages.valid) {
      return null;
    } else {
      return {
        productionStages: this.productionStages.controls.filter(c => !c.valid).map(c => c.errors)
      };
    }
  }

  ngOnInit(): void {
  }

  onDeleteStage(idx: number) {
    this.productionStages.removeAt(idx);
    this.table?.renderRows();
  }

  onNewProductionStage(): void {
    this.productionStages.push(productionStage());
    this.table?.renderRows();
  }

  onExpand(stage: ProductionStageGroup) {
    this.expanded = this.expanded === stage ? undefined : stage;
    this.table.renderRows();
  }



}


function productionStage(stage?: Partial<JobProductionStage>) {
  return new FormGroup({
    productionStageId: new FormControl(
      stage?.productionStageId,
      [Validators.required],
    ),
    materials: new FormControl<JobProductionStageMaterial[]>(stage?.materials || []),
    amount: new FormControl(
      stage?.amount || 0,
      [Validators.required, Validators.min(0)],
    ),
    fixedAmount: new FormControl(
      stage?.fixedAmount || 0,
      [Validators.required, Validators.min(0)],
    ),
  });
}
