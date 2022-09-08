import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColorTotals, KastesJob, Veikals } from 'src/app/kastes/interfaces';
import { colorTotalsFromVeikali, kastesTotalsFromVeikali, sortColorTotals, jobProductsToColorTotals } from '../../common';

@Component({
  selector: 'app-job-info',
  templateUrl: './job-info.component.html',
  styleUrls: ['./job-info.component.scss']
})
export class JobInfoComponent implements OnInit {

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

  constructor() { }

  ngOnInit(): void {
  }


}
