import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ProductionStagesFormSource } from '../services/production-stages-form-source';
import { ProductionStagesService } from 'src/app/services/production-stages.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { ProductionStage } from 'src/app/interfaces';
import { EquipmentService } from '../../equipment/services/equipment.service';

@Component({
  selector: 'app-production-stages-edit',
  templateUrl: './production-stages-edit.component.html',
  styleUrls: ['./production-stages-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionStagesEditComponent implements OnInit, CanComponentDeactivate {

  formSource = new ProductionStagesFormSource(this.fb, this.productionStagesService);

  equipment$ = this.equipmentService.equipment$;

  get form(): FormGroup {
    return this.formSource.form;
  }

  constructor(
    private fb: FormBuilder,
    private productionStagesService: ProductionStagesService,
    private equipmentService: EquipmentService,
  ) { }

  ngOnInit(): void {
    this.equipmentService.setFilter(null);
  }

  onSetData(value: ProductionStage) {
    this.formSource.initValue(value);
  }

  canDeactivate(): boolean {
    return this.form.pristine;
  }

}
