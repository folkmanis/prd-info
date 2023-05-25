import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-kastes-totals',
  standalone: true,
  templateUrl: './kastes-totals.component.html',
  styleUrls: ['./kastes-totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
  ]
})
export class KastesTotalsComponent {

  @Input() totals: [number, number][] = [];

}
