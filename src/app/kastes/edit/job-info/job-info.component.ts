import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColorTotals, KastesJob, Veikals } from 'src/app/interfaces';
import { colorTotalsFromVeikali, colorTotalsFromVeikalsBoxs } from '../../common';

type KastesJobInfo = Pick<KastesJob, 'jobId' | 'receivedDate' | 'dueDate' | 'apjomsPlanned' | 'jobStatus'>;

@Component({
  selector: 'app-job-info',
  templateUrl: './job-info.component.html',
  styleUrls: ['./job-info.component.scss']
})
export class JobInfoComponent implements OnInit {

  @Input() get job(): KastesJob | undefined { return this._job; }
  set job(job: KastesJob | undefined) {
    this._job = job;
    this.colorTotals = colorTotalsFromVeikali(job?.veikali || []);
    this.plannedTotals = job?.apjomsPlanned.sort((a, b) => a.color.localeCompare(b.color)) || [];
  }
  private _job: KastesJob | undefined;

  colorTotals: ColorTotals[] = [];
  plannedTotals: ColorTotals[] = [];

  @Output() activeJob = new EventEmitter<number>();

  @Output() deleteVeikali = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }


}
