import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { EquipmentFormSource } from '../services/equipment-form-source';
import { EquipmentService } from '../services/equipment.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Equipment } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';


@Component({
  selector: 'app-equipment-edit',
  templateUrl: './equipment-edit.component.html',
  styleUrls: ['./equipment-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EquipmentEditComponent implements OnInit, CanComponentDeactivate {

  formSource: EquipmentFormSource;

  get form(): FormGroup {
    return this.formSource.form;
  }

  constructor(
    private fb: FormBuilder,
    private equipmentService: EquipmentService,
  ) {
    this.formSource = new EquipmentFormSource(this.fb, this.equipmentService);
  }

  ngOnInit(): void {
  }

  onDataChange(value: Equipment) {
    this.formSource.initValue(value);
  }

  canDeactivate(): boolean {
    return this.form.pristine;
  }

}
