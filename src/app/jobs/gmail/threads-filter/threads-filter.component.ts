import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { LabelListItem, ThreadsFilterQuery } from '../interfaces';

type FilterOutput = Pick<ThreadsFilterQuery, 'labelIds'>;

@Component({
  selector: 'app-threads-filter',
  templateUrl: './threads-filter.component.html',
  styleUrls: ['./threads-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreadsFilterComponent {

  @Input() set initialCategory(value: string) {
    this.filterForm.controls.label.setValue(value);
  }

  @Input() labels: LabelListItem[] = [];

  filterForm = new FormGroup({
    label: new FormControl<string>('')
  });

  @Output() valueChanges: Observable<FilterOutput> = this.filterForm.valueChanges.pipe(
    map(value => ({ labelIds: [value.label] })),
  );

}
