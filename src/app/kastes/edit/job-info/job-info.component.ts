import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KastesJob } from 'src/app/interfaces';

type KastesJobInfo = Pick<KastesJob, 'jobId' | 'receivedDate' | 'dueDate' | 'apjomsPlanned' | 'jobStatus'>;

@Component({
  selector: 'app-job-info',
  templateUrl: './job-info.component.html',
  styleUrls: ['./job-info.component.scss']
})
export class JobInfoComponent implements OnInit {

  @Input() job: KastesJobInfo | undefined;

  @Output() activeJob = new EventEmitter<number>();

  @Output() deleteKastes = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }


}
