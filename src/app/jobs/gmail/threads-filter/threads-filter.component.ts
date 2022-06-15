import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
    this.filterForm.get('label').setValue(value);
  }

  @Input() labels: LabelListItem[] = [];

  filterForm = new UntypedFormGroup({
    label: new UntypedFormControl()
  });

  @Output() valueChanges: Observable<FilterOutput> = this.filterForm.valueChanges.pipe(
    map(value => ({ labelIds: [value.label] })),
  );

}
