import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ProductUnit } from 'src/app/interfaces';

@Component({
  selector: 'app-units-dialog',
  templateUrl: './units-dialog.component.html',
  styleUrls: ['./units-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitsDialogComponent implements OnInit {

  unitsForm = new FormGroup({
    shortName: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    disabled: new FormControl(false),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private data?: ProductUnit,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.unitsForm.setValue(this.data);
      this.unitsForm.controls.shortName.disable();
    }
  }


}
