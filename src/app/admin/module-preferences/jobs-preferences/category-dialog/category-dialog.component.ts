import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {


  constructor(
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
  ) { }

  productForm = new FormGroup({
    category: new FormControl('', { validators: Validators.required }),
    description: new FormControl(''),
  });

  ngOnInit(): void {
  }

  onSubmit() {
    this.dialogRef.close(this.productForm.value);
  }

}
