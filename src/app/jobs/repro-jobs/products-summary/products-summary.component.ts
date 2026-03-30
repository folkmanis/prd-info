import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { JobsProduction } from '../../interfaces';

@Component({
  selector: 'app-products-summary',
  templateUrl: './products-summary.component.html',
  styleUrls: ['./products-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProductsSummaryComponent {
  productsSummary = input.required<JobsProduction[]>();

  productHover = output<string | null>();

  onMouseEnter(name: string) {
    this.productHover.emit(name);
  }

  onMouseLeave() {
    this.productHover.emit(null);
  }
}
