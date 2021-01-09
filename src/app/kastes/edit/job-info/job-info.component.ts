import { Component, OnInit, Input } from '@angular/core';
import { KastesJob } from 'src/app/interfaces';

@Component({
  selector: 'app-job-info',
  templateUrl: './job-info.component.html',
  styleUrls: ['./job-info.component.scss']
})
export class JobInfoComponent implements OnInit {

  @Input() job: KastesJob | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
