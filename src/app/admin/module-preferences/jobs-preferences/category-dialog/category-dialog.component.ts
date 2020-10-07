import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  productForm = new FormGroup({
    category: new FormControl('', { validators: Validators.required }),
    description: new FormControl(''),
  });

  ngOnInit(): void {
  }

}
