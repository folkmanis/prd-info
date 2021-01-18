import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColorTotals, KastesJob, Veikals } from 'src/app/interfaces';
import { colorTotalsFromVeikali, kastesTotalsFromVeikali, sortColorTotals } from '../../common';

@Component({
  selector: 'app-job-info',
  templateUrl: './job-info.component.html',
  styleUrls: ['./job-info.component.scss']
})
export class JobInfoComponent implements OnInit {

  @Input() get job(): KastesJob | undefined { return this._job; }
  set job(job: KastesJob | undefined) {
    this._job = job;
    this.plannedTotals = sortColorTotals(job?.apjomsPlanned || []).map(tot => ({ ...tot, total: tot.total * 2 }));
    this.colorTotals = colorTotalsFromVeikali(job?.veikali || []);
    this.kastesTotals = kastesTotalsFromVeikali(job?.veikali || []);
  }
  private _job: KastesJob | undefined;

  colorTotals: ColorTotals[] = [];
  plannedTotals: ColorTotals[] = [];
  kastesTotals: [number, number][] = [];

  @Output() activeJob = new EventEmitter<number>();

  @Output() deleteVeikali = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }


}
