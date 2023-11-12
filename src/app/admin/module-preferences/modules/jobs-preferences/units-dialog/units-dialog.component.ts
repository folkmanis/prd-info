import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { ProductUnit } from 'src/app/interfaces';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-units-dialog',
    templateUrl: './units-dialog.component.html',
    styleUrls: ['./units-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
    ],
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
