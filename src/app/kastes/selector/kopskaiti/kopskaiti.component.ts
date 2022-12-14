import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Colors, Totals } from 'src/app/kastes/interfaces';

@Component({
  selector: 'app-kopskaiti',
  templateUrl: './kopskaiti.component.html',
  styleUrls: ['./kopskaiti.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KopskaitiComponent {
  @Input() colorCodes: { [key in Colors]: string; };
  @Input() totals: Totals;

  constructor(
  ) { }


}
