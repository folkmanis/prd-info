import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutService } from 'src/app/services/layout.service';
import { ProductionStagesService } from '../../../production-stages/services/production-stages.service';
import { ProductsFormSource } from '../../services/products-form-source';

export interface DialogData {
  stageForm: FormGroup;
}

@Component({
  selector: 'app-production-stage-editor',
  templateUrl: './production-stage-editor.component.html',
  styleUrls: ['./production-stage-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionStageEditorComponent implements OnInit {

  stageForm: FormGroup;

  stages$ = this.productionStages.productionStages$;

  isSmall$ = this.layout.isSmall$;

  get name() {
    return this.stageForm.get('name') as FormControl;
  }

  get materials() {
    return this.stageForm.get('materials') as FormArray;
  }

  get productName() {
    return this.formSource.value.name;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private productionStages: ProductionStagesService,
    private formSource: ProductsFormSource,
    private layout: LayoutService,
  ) { }

  ngOnInit(): void {
    this.productionStages.setFilter(null);
    this.stageForm = this.data.stageForm;
  }


}
