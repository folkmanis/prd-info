import { ChangeDetectionStrategy, Component, Input, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Label, LabelListItem, getLabelDisplayName } from '../interfaces';

export interface ThreadsFilterData {
  activeLabels: Label[];
  availableLabels: Observable<LabelListItem[]>;
}

@Component({
  selector: 'app-threads-filter',
  templateUrl: './threads-filter.component.html',
  styleUrls: ['./threads-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
