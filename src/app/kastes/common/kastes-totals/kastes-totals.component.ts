import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-kastes-totals',
  templateUrl: './kastes-totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KastesTotalsComponent {
  totals = input<[number, number][]>([]);
}
