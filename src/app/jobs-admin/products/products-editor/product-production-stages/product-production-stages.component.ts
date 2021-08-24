import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { DestroyService } from 'prd-cdk';
import { merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductionStagesService } from '../../../production-stages/services/production-stages.service';
import { ProductionStageGroup, ProductsFormSource } from '../../services/products-form-source';

@Component({
  selector: 'app-product-production-stages',
  templateUrl: './product-production-stages.component.html',
  styleUrls: ['./product-production-stages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class ProductProductionStagesComponent implements OnInit {

  @ViewChild(MatTable) private table: MatTable<FormGroup>;

  @Input() stagesArray: FormArray;

  displayedColumns = ['expand', 'productionStageId', 'amount', 'fixedAmount', 'actions'];

  stages$ = this.productionStagesService.productionStages$;

  expanded: FormGroup | undefined;

  whenFn = (idx: number, rowData: FormGroup): boolean => rowData === this.expanded;

  constructor(
    private productionStagesService: ProductionStagesService,
    private formSource: ProductsFormSource,
    private destroy$: DestroyService,
  ) { }

  ngOnInit(): void {
    merge(
      this.stagesArray.valueChanges,
      this.stagesArray.statusChanges,
    ).pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => this.table.renderRows());
  }

  onDeleteStage(idx: number) {
    this.formSource.removeProductionStage(idx);
  }

  onNewProductionStage(): void {
    this.stagesArray.push(new ProductionStageGroup());
  }

  onExpand(stage: FormGroup) {
    this.expanded = this.expanded === stage ? undefined : stage;
    this.table.renderRows();
  }

}
