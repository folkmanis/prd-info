import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ColorTotals, KastesJob, Veikals } from 'src/app/kastes/interfaces';
import { ColorTotalsComponent, KastesTotalsComponent, colorTotalsFromVeikali, jobProductsToColorTotals, kastesTotalsFromVeikali } from '../../common';

@Component({
  selector: 'app-job-info',
  standalone: true,
  templateUrl: './job-info.component.html',
  styleUrls: ['./job-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ColorTotalsComponent,
    MatButtonModule,
    RouterLink,
    KastesTotalsComponent,
  ]
})
export class JobInfoComponent {

  private _job: KastesJob | undefined;
  @Input() get job(): KastesJob | undefined {
    return this._job;
  }
  set job(value: KastesJob | undefined) {
    if (!value) {
      return;
    }
    this._job = value;
    this.plannedTotals = jobProductsToColorTotals(value.products || []);
  }

  private _veikali: Veikals[] = [];
  @Input() set veikali(value: Veikals[]) {
    value = value || [];
    this._veikali = value;
    this.colorTotals = colorTotalsFromVeikali(value);
    this.kastesTotals = kastesTotalsFromVeikali(value);
  }
  get veikali() {
    return this._veikali;
  }

  @Input() activeJobId: number | null = null;

  colorTotals: ColorTotals[] = [];
  plannedTotals: ColorTotals[] = [];
  kastesTotals: [number, number][] = [];

  @Output() activeJob = new EventEmitter<number>();

  @Output() deleteVeikali = new EventEmitter<number>();


}
