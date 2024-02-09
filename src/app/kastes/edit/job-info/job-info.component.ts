import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ColorTotals, KastesJob, Veikals } from 'src/app/kastes/interfaces';
import {
  ColorTotalsComponent,
  KastesTotalsComponent,
  colorTotalsFromVeikali,
  jobProductsToColorTotals,
  kastesTotalsFromVeikali,
} from '../../common';

@Component({
  selector: 'app-job-info',
  standalone: true,
  templateUrl: './job-info.component.html',
  styleUrls: ['./job-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ColorTotalsComponent,
    MatButtonModule,
    RouterLink,
    KastesTotalsComponent,
    DatePipe,
  ],
})
export class JobInfoComponent {
  @Input() job!: KastesJob;

  @Input() veikali: Veikals[] | null = null;

  @Input() activeJobId: number | null = null;

  @Output() activeJob = new EventEmitter<number>();

  @Output() deleteVeikali = new EventEmitter<number>();

  @Output() copyToFirebase = new EventEmitter<void>();

  @Output() copyFromFirebase = new EventEmitter<void>();

  plannedTotals(): ColorTotals[] {
    return jobProductsToColorTotals(this.job.products || []);
  }

  colorTotals(): ColorTotals[] {
    return colorTotalsFromVeikali(this.veikali || []);
  }

  kastesTotals(): [number, number][] {
    return kastesTotalsFromVeikali(this.veikali || []);
  }
}
