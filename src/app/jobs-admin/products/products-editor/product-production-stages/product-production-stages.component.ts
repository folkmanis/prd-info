import { ChangeDetectionStrategy, Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { JobProductionStage } from 'src/app/interfaces';
import { ProductionStagesService } from '../../../production-stages/services/production-stages.service';
import { ProductionStageGroup, ProductsFormSource } from '../../services/products-form-source';
import { DialogData, ProductionStageEditorComponent } from '../production-stage-editor/production-stage-editor.component';

@Component({
  selector: 'app-product-production-stages',
  templateUrl: './product-production-stages.component.html',
  styleUrls: ['./product-production-stages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductProductionStagesComponent implements OnInit {

  get stagesArray(): FormArray {
    return this.formSource.productionStages;
  }

  data$: Observable<JobProductionStage[]>;

  displayedColumns = ['name', 'actions'];

  private stageValue: JobProductionStage;

  constructor(
    private dialog: MatDialog,
    private productionStagesService: ProductionStagesService,
    private viewContainerRef: ViewContainerRef,
    private formSource: ProductsFormSource,
  ) { }

  ngOnInit(): void {
    this.data$ = combineLatest([
      this.stagesArray.valueChanges.pipe(startWith(this.stagesArray.value)),
      this.productionStagesService.productionStages$,
    ]).pipe(
      map(([values, stages]) => (values as JobProductionStage[]).map(val => ({
        ...val,
        name: stages.find(st => st._id === val.productionStageId)?.name,
      })))
    );
  }

  onEditStage(idx: number) {
    const stageForm = this.stagesArray.at(idx) as FormGroup;
    this.stageValue = stageForm.value;
    this.dialog.open<ProductionStageEditorComponent, DialogData, JobProductionStage | undefined>(
      ProductionStageEditorComponent,
      this.productionStageConfig(stageForm),
    ).afterClosed()
      .subscribe(resp => {
        if (!resp) {
          stageForm.setValue(this.stageValue);
        }
        this.stageValue = undefined;
      });
  }

  onDeleteStage(idx: number) {
    this.formSource.removeProductionStage(idx);
  }

  onNewProductionStage(): void {
    const stageForm = new ProductionStageGroup();
    this.dialog.open<ProductionStageEditorComponent, DialogData, JobProductionStage | undefined>(
      ProductionStageEditorComponent,
      this.productionStageConfig(stageForm),
    ).afterClosed()
      .subscribe(resp => {
        if (resp) {
          this.stagesArray.push(stageForm);
        }
      });
  }

  private productionStageConfig(stageForm: FormGroup): MatDialogConfig<DialogData> {
    return {
      data: {
        stageForm,
      },
      minWidth: 300,
      viewContainerRef: this.viewContainerRef
    };
  }

}
