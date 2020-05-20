import { Component, Input, OnInit } from '@angular/core';
import { Totals } from '../../services/kaste.class';

@Component({
  selector: 'app-colors-output',
  templateUrl: './colors-output.component.html',
  styleUrls: ['./colors-output.component.css']
})
export class ColorsOutputComponent implements OnInit {
  @Input('colorsRemain') set totals(_tot: Totals) {
    this.totalsColors = Array.from(_tot.colorMap);
  }
  totalsColors: any[];

  constructor(
  ) { }

  ngOnInit() {
  }

}
