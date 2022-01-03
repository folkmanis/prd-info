import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { JobState, ProductCategory } from 'src/app/interfaces';
import { DateUtilsService } from 'src/app/library/date-services';
import { JobsProductionFilter } from '../../../interfaces';

@Component({
  selector: 'app-filter-summary',
  templateUrl: './filter-summary.component.html',
  styleUrls: ['./filter-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSummaryComponent implements OnChanges {

  @Input() query: JobsProductionFilter | null;

  @Input() states: JobState[] = [];

  @Input() categories: ProductCategory[] = [];

  state: string | null = null;
  category: string | null = null;
  interval: string = '';

  constructor(
    private dateUtils: DateUtilsService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {

    if (!this.query) {
      return;
    }

    if (changes.query || changes.states) {
      this.state = this.states.filter(state => this.query.jobStatus?.includes(state.state)).map(state => state.description).join(', ');
    }

    if (changes.query || changes.categories) {
      this.category = this.categories.filter(ctg => this.query.category?.includes(ctg.category)).map(ctg => ctg.description).join(', ');
    }

    if (changes.query) {
      const { fromDate, toDate } = this.query;
      this.interval = '';
      if (fromDate) {
        this.interval += this.dateUtils.localDate(fromDate);
      }
      this.interval += ' - ';
      if (toDate) {
        this.interval += this.dateUtils.localDate(toDate);
      }
    }

  }


}
