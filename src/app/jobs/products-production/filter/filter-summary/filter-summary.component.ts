import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input
} from '@angular/core';
import { JobState, ProductCategory } from 'src/app/interfaces';
import { DateUtilsService } from 'src/app/library/date-services';
import { ProductsFormData } from '../products-production-filter-form.service';

@Component({
  selector: 'app-filter-summary',
  templateUrl: './filter-summary.component.html',
  styleUrls: ['./filter-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FilterSummaryComponent {

  private dateUtils = inject(DateUtilsService);

  query = input<ProductsFormData | null>(null);

  states = input<JobState[]>([]);

  categories = input<ProductCategory[]>([]);

  state = computed(() => {
    const query = this.query();
    if (Array.isArray(query?.jobStatus)) {
      return this.states()
        .filter((state) => query.jobStatus.includes(state.state))
        .map((state) => state.description)
        .join(', ');
    } else {
      return '';
    }

  });

  category = computed(() => {
    const query = this.query();
    if (Array.isArray(query?.category)) {
      return this.categories()
        .filter((ctg) => query.category.includes(ctg.category))
        .map((ctg) => ctg.description)
        .join(', ');
    } else {
      return '';
    }
  });

  interval = computed(() => {
    const query = this.query();
    let interval = '';
    if (query) {
      const { fromDate, toDate } = query;
      if (fromDate) {
        interval += this.dateUtils.localDate(fromDate);
      }
      interval += ' - ';
      if (toDate) {
        interval += this.dateUtils.localDate(toDate);
      }
    }
    return interval;
  });

}
