import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface FilterSummary {
  jobsId: string;
  name: string;
  customer: string;
  productsName: string;
}

@Component({
  selector: 'app-filter-summary',
  imports: [],
  templateUrl: './filter-summary.component.html',
  styleUrl: './filter-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSummaryComponent {
  summary = input.required<Partial<FilterSummary>>();

  selectedStates = input.required<string>();
}
