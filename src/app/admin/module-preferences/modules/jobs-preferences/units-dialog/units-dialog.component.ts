import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFormGroup, IFormBuilder } from '@rxweb/types';
import { ProductUnit } from 'src/app/interfaces';

@Component({
  selector: 'app-units-dialog',
  templateUrl: './units-dialog.component.html',
  styleUrls: ['./units-dialog.component.scss']
})
export class UnitsDialogComponent implements OnInit {

  private fb: IFormBuilder;
  unitsForm: IFormGroup<ProductUnit>;

  constructor(
    fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data?: ProductUnit,
  ) {
    this.fb = fb;
    this.unitsForm = this.fb.group<ProductUnit>({
      shortName: [
        { value: data?.shortName || '', disabled: !!this.data },
        [Validators.required]
      ],
      description: [
        data?.description || ''
      ],
      disabled: [data?.disabled || false],
    });
  }

  ngOnInit(): void {
  }


}
