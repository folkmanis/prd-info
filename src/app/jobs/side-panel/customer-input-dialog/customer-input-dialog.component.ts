import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { CustomerPartial } from 'src/app/interfaces';

@Component({
  selector: 'app-customer-input-dialog',
  templateUrl: './customer-input-dialog.component.html',
  styleUrls: ['./customer-input-dialog.component.css']
})
export class CustomerInputDialogComponent implements OnInit {

  customers: CustomerPartial[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { customers: CustomerPartial[]; },
  ) {
    this.customers = data.customers;
  }

  custControl = new FormControl(null, { validators: Validators.required });

  ngOnInit(): void {
  }

}
