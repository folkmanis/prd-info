import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-count',
  templateUrl: './status-count.component.html',
  styleUrls: ['./status-count.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusCountComponent {

  @Input() count: number | null;

  isMultiple(value: number): boolean {
    return value % 10 !== 1 || value === 11;
  }
}
