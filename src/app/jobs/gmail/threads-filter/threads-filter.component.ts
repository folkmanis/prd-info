import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, Subject, map } from 'rxjs';
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
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
})
export class ThreadsFilterComponent {
  @Input() labelIds: string[] | null = null;

  @Output() labelIdsChange = new Subject<string[]>();

  labelItems$ = inject(GmailService)
    .labels()
    .pipe(
      map((label) =>
        label.sort((a, b) =>
          a.displayName.toUpperCase() > b.displayName.toUpperCase() ? 1 : -1
        )
      )
    );

  isLabelActive = (label: LabelListItem) => this.labelIds?.includes(label.id);

  get activeLabelsText() {
    return this.labelIds?.map((l) => getLabelDisplayName(l)).join(', ') || '';
  }

  onActivateLabel(label: LabelListItem) {
    this.labelIdsChange.next([label.id]);
  }
}
