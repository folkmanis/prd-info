import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-status-count',
  templateUrl: './status-count.component.html',
  styleUrls: ['./status-count.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class StatusCountComponent {
  count = input<number | null>(null);

  isMultiple(value: number): boolean {
    return value % 10 !== 1 || value === 11;
  }
}
