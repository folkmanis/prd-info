import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ProductionStage } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { EquipmentService } from '../../equipment/services/equipment.service';
import { ProductionStagesFormSource } from '../services/production-stages-form-source';


@Component({
  selector: 'app-production-stages-edit',
  templateUrl: './production-stages-edit.component.html',
  styleUrls: ['./production-stages-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: SimpleFormSource, useExisting: ProductionStagesFormSource }
  ]
})
export class ProductionStagesEditComponent implements OnInit, CanComponentDeactivate {

  equipment$ = this.equipmentService.equipment$;

  get form(): UntypedFormGroup {
    return this.formSource.form;
  }

  constructor(
    private equipmentService: EquipmentService,
    private formSource: ProductionStagesFormSource,
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
