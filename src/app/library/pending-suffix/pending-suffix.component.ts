import { booleanAttribute, Component, computed, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  imports: [MatProgressSpinner],
  selector: 'app-pending-suffix',
  styleUrl: './pending-suffix.component.scss',
  templateUrl: './pending-suffix.component.html',
})
export class PendingSuffix {
  pending = input<boolean>(false, { transform: booleanAttribute });

  progressIndicator = input<boolean>(false, { transform: booleanAttribute });

  protected active = computed(() => this.progressIndicator() || this.pending());

  protected label = computed(() => (this.progressIndicator() ? 'Loading' : 'Checking'));
}
