import { Component, Input } from '@angular/core';
import { Colors, Totals } from 'src/app/interfaces';

@Component({
  selector: 'app-kopskaiti',
  templateUrl: './kopskaiti.component.html',
  styleUrls: ['./kopskaiti.component.scss'],
})
export class KopskaitiComponent  {
  @Input() colorCodes: { [key in Colors]: string; };
  @Input() totals: Totals;

  constructor(
  ) { }


}
