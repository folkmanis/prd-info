import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-status-count',
  templateUrl: './status-count.component.html',
  styleUrls: ['./status-count.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatProgressSpinnerModule],
})
export class StatusCountComponent {
  @Input() count: number | null;

  isMultiple(value: number): boolean {
    return value % 10 !== 1 || value === 11;
  }
}
