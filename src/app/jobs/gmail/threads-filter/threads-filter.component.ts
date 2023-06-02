import { ChangeDetectionStrategy, Component, Input, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Label, LabelListItem, getLabelDisplayName } from '../interfaces';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

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
        NgIf,
        NgFor,
        MatProgressSpinnerModule,
        AsyncPipe,
    ],
})
export class ThreadsFilterComponent {

  @Input() labelIds: string[] | null = null;

  @Input() labelItems: Observable<LabelListItem[]>;

  @Output() labelIdsChange = new Subject<string[]>();

  isLabelActive = (label: LabelListItem) => this.labelIds?.includes(label.id);

  get activeLabelsText() {
    return this.labelIds?.map(l => getLabelDisplayName(l)).join(', ') || '';
  }


  onActivateLabel(label: LabelListItem) {
    this.labelIdsChange.next([label.id]);
  }


}
