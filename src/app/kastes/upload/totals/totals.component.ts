import { Component, OnInit, Input } from '@angular/core';
import { Kaste, Colors, ColorTotals } from 'src/app/interfaces';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss']
})
export class TotalsComponent implements OnInit {

  @Input() colorTotals: ColorTotals[] = [];
  @Input() colors: { [key in Colors]?: string } = {};

  constructor() { }

  ngOnInit(): void {
  }

}
