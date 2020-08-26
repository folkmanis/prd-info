import { Component, OnInit } from '@angular/core';
import { KastesTabulaService } from '../services/kastes-tabula.service';

@Component({
  selector: 'app-select-tabula',
  templateUrl: './select-tabula.component.html',
  styleUrls: ['./select-tabula.component.css'],
  providers: [
    KastesTabulaService,
  ]
})
export class SelectTabulaComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
