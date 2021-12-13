import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Equipment } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { EquipmentFormSource } from '../services/equipment-form-source';


@Component({
  selector: 'app-equipment-edit',
  templateUrl: './equipment-edit.component.html',
  styleUrls: ['./equipment-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: SimpleFormSource, useExisting: EquipmentFormSource }
  ]
})
export class EquipmentEditComponent implements OnInit, CanComponentDeactivate {


  get form(): FormGroup {
    return this.formSource.form;
  }

  constructor(
    private formSource: EquipmentFormSource,
  ) { }

  ngOnInit(): void {
  }

  onDataChange(value: Equipment) {
    this.formSource.initValue(value);
  }

  canDeactivate(): boolean {
    return this.form.pristine;
  }

}
