import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-kastes-totals',
  standalone: true,
  templateUrl: './kastes-totals.component.html',
  styleUrls: ['./kastes-totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KastesTotalsComponent {
  @Input() totals: [number, number][] = [];
}
