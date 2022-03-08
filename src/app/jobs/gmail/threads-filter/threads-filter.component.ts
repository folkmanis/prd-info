import { Component, OnInit, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { LabelListItem, ThreadsFilterQuery } from '../interfaces';

type FilterOutput = Pick<ThreadsFilterQuery, 'labelIds'>;

const defaultLabel = 'CATEGORY_PERSONAL';

@Component({
  selector: 'app-threads-filter',
  templateUrl: './threads-filter.component.html',
  styleUrls: ['./threads-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreadsFilterComponent implements OnInit {

  @Input() labels: LabelListItem[] = [];

  filterForm = new FormGroup({
    label: new FormControl(defaultLabel)
  });

  @Output() valueChanges: Observable<FilterOutput> = this.filterForm.valueChanges.pipe(
    startWith(this.filterForm.value),
    map(value => ({ labelIds: [value.label] }))
  );

  constructor() { }

  ngOnInit(): void {
  }

}
