import { ChangeDetectionStrategy, Component, computed, inject, input, output, resource } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { Label, LabelListItem, getLabelDisplayName } from '../interfaces';
import { GmailService } from '../services/gmail.service';

export interface ThreadsFilterData {
  activeLabels: Label[];
  availableLabels: Observable<LabelListItem[]>;
}

@Component({
  selector: 'app-threads-filter',
  templateUrl: './threads-filter.component.html',
  styleUrls: ['./threads-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule],
})
export class ThreadsFilterComponent {
  #gmailService = inject(GmailService);

  protected labels = resource({
    loader: async () => {
      const labels = await this.#gmailService.labels();
      return labels
        .map((label) => ({
          ...label,
          displayName: getLabelDisplayName(label.name),
        }))
        .sort((a, b) => (a.displayName.toUpperCase() > b.displayName.toUpperCase() ? 1 : -1));
    },
  });

  labelIds = input<string[] | null>();

  labelIdsChange = output<string[]>();

  isLabelActive = (label: LabelListItem) => this.labelIds()?.includes(label.id);

  activeLabelsText = computed(() => {
    return (
      this.labelIds()
        ?.map((l) => getLabelDisplayName(l))
        .join(', ') || ''
    );
  });

  onActivateLabel(label: LabelListItem) {
    this.labelIdsChange.emit([label.id]);
  }
}
