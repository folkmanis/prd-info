import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-deleted-snackbar',
  templateUrl: './deleted-snackbar.component.html',
  styleUrls: ['./deleted-snackbar.component.scss']
})
export class DeletedSnackbarComponent implements OnInit {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: number,
  ) { }

  ngOnInit(): void {
  }

}
