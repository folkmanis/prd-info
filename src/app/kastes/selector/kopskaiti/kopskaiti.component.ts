import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Colors, Totals } from 'src/app/kastes/interfaces';
import { ColorsOutputComponent } from './colors-output/colors-output.component';

@Component({
  selector: 'app-kopskaiti',
  templateUrl: './kopskaiti.component.html',
  styleUrls: ['./kopskaiti.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ColorsOutputComponent],
})
export class KopskaitiComponent {
  @Input({ required: true }) colorCodes!: { [key in Colors]: string };
  @Input({ required: true }) totals!: Totals;
}
