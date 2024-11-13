import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KastesJob, Veikals } from 'src/app/kastes/interfaces';
import { jobProductsToColorTotals } from '../../common/color-totals-from-veikali';
import { ColorTotalsComponent } from '../../common/color-totals/color-totals.component';
import { KastesTotalsComponent } from '../../common/kastes-totals/kastes-totals.component';
import { totalsFromAddresesWithPackages } from '../../services/item-packing.utilities';

@Component({
  selector: 'app-job-info',
  standalone: true,
  templateUrl: './job-info.component.html',
  styleUrls: ['./job-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ColorTotalsComponent, KastesTotalsComponent, DatePipe],
})
export class JobInfoComponent {
  job = input.required<KastesJob>();

  veikali = input.required<Veikals[]>();

  activeJobId = input.required<number>();

  plannedTotals = computed(() => jobProductsToColorTotals(this.job().products || []));

  totals = computed(() => totalsFromAddresesWithPackages(this.veikali()));
}
